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

function handlePostMessage(event) {
  if (event.data === 'login-finished') removeLoadingAnimation()
}

function showWrongCredentialsMessage() {
  const message = document.getElementById('message')
  message.innerHTML = 'The username or password you entered is incorrect.'
  message.classList.add('message-error')
  message.classList.remove('message-info')
}

function showLogoutMessage() {
  const message = document.getElementById('message')
  message.innerHTML = 'You have been successfully logged out. Log in again.'
  message.classList.add('message-info')
  message.classList.remove('message-error')
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
  performLoginRequest(loginUrl, data)
    .then(
      () => 'login-processing',
      (error) => {
        if (error instanceof ForbiddenError) {
          const fallbackUrl = new URL('login_check', fallbackIDP)
          return performLoginRequest(fallbackUrl, data).then(
            () => 'login-fallback',
            () => 'login-fallback'
          )
        }

        if (error instanceof UnauthorisedError) showWrongCredentialsMessage()
        return 'login-processing'
      }
    )
    .then((message) => {
      if (window.location !== window.parent.location) {
        // The page is in an iframe
        window.parent.postMessage(message, window.location.origin)
      } else window.location = '/'
    })

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
        showLogoutMessage()
        break
      default:
    }
  }

  const form = document.getElementById('login-form')
  form.addEventListener('submit', login)
})

window.addEventListener('login-processing', addLoadingAnimation)
window.addEventListener('login-finished', removeLoadingAnimation)
window.addEventListener('message', handlePostMessage)
