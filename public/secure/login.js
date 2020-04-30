/* eslint-disable max-classes-per-file */

class UnauthorisedError extends Error {}
class ForbiddenError extends Error {}

function performLoginRequest(url, data) {
  return fetch(url, {
    method: 'POST',
    body: data,
    credentials: 'include',
  }).then((response) => {
    if (response.status === 401)
      throw new UnauthorisedError('Wrong credentials')
    if (response.status === 402 || response.status === 403)
      throw new ForbiddenError('User does not have access to this version')
    return response
  })
}

function addLoadingAnimation() {
  const form = document.getElementById('login-form')
  form.classList.add('loading')
}

function removeLoadingAnimation() {
  const form = document.getElementById('login-form')
  form.classList.remove('loading')
}

function showWrongCredentialsMessage() {
  const message = document.getElementById('message')
  message.innerHTML = 'The username or password you entered is incorrect.'
  message.classList.add('message-error')
  message.classList.remove('message-info')
}

function showInfoMessage(message) {
  const messageEl = document.getElementById('message')
  messageEl.innerHTML = message
  messageEl.classList.add('message-info')
  messageEl.classList.remove('message-error')
}

function login(event) {
  event.preventDefault()
  const urlParams = new URLSearchParams(window.location.search)
  const identityProviderUrl =
    urlParams.get('identity_provider_url') || 'https://api.core.ac.uk/'
  const fallbackIDP =
    urlParams.get('fallback_idp') || 'https://dashboard.core.ac.uk/'

  window.dispatchEvent(new Event('login-processing'))
  const formData = new FormData(event.target)
  const data = new URLSearchParams(formData)
  const loginUrl = new URL('login_check', identityProviderUrl)
  performLoginRequest(loginUrl, data).then(
    () => {
      window.top.location.href = '/'
    },
    (error) => {
      window.dispatchEvent(new Event('login-finished'))
      if (error instanceof ForbiddenError) {
        const fallbackUrl = new URL('login_check', fallbackIDP)
        return performLoginRequest(fallbackUrl, data).finally(() => {
          window.top.location.replace(fallbackIDP)
        })
      }

      if (error instanceof UnauthorisedError) showWrongCredentialsMessage()
      return Promise.resolve()
    }
  )

  return false
}

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search)
  const reason = urlParams.get('reason')
  if (reason) {
    switch (reason) {
      case 'wrong_credentials':
        showWrongCredentialsMessage()
        break
      case 'logout':
        showInfoMessage('You have been successfully logged out.')
        break
      case 'registration':
        showInfoMessage(
          'You have been successfully registered. Please log in now.'
        )
        break
      case 'reset':
        showInfoMessage(
          'Your password has been reset successfully. Please log in now.'
        )
        break
      default:
    }
  }

  const form = document.getElementById('login-form')
  form.addEventListener('submit', login)
})

window.addEventListener('login-processing', addLoadingAnimation)
window.addEventListener('login-finished', removeLoadingAnimation)
