// eslint-disable-next-line max-classes-per-file
class UnauthorisedError extends Error {}
class WrongInputError extends Error {}

const urlParams = new URLSearchParams(window.location.search)
const email = document.getElementById('email')
const token = document.getElementById('token')
const form = document.getElementById('password-form')
const requiredInputs = form.querySelectorAll('[required]')
const password = document.getElementById('password')
const newPassword = document.getElementById('newPassword')
const newPasswordAgain = document.getElementById('newPasswordAgain')

function performApiRequest(url, data) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  }).then((response) => {
    if (response.status === 401)
      throw new UnauthorisedError('Wrong credentials')

    // TODO: We should distinguish errors.
    //     Currently API sends only 400 `{"message": "error"}`
    if (response.status !== 200) {
      throw new WrongInputError(
        'Password reset error. Please request reset password again!'
      )
    }
    return response
  })
}

function showSuccessMessage() {
  const messageEl = document.getElementById('message')
  let message = 'Password changed successfully.'

  if (urlParams.has('token'))
    message += ' You can <a href="/login" target="_top">log in</a> now.'
  messageEl.innerHTML = message
  messageEl.classList.remove('danger')
  messageEl.classList.add('success')
}

function showErrorMessage(message) {
  const messageEl = document.getElementById('message')
  messageEl.innerHTML = message
  messageEl.classList.remove('success')
  messageEl.classList.add('danger')
}

function checkNewPasswordsMatch() {
  if (newPassword.value !== newPasswordAgain.value)
    newPasswordAgain.setCustomValidity('Passwords must match.')
  else newPasswordAgain.setCustomValidity('')
}

function resetInputs() {
  requiredInputs.forEach((el) => {
    el.classList.remove('touched')
  })
}

function changePassword(event) {
  event.preventDefault()

  const identityProviderUrl =
    urlParams.get('identity_provider_url') || 'https://api02.core.ac.uk/'

  const formData = new FormData(event.target)
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    newPassword: formData.get('newPassword'),
    confirmationToken: formData.get('token'),
  }

  // remove empty params
  Object.entries(data).forEach(([key, value]) => {
    if (!value) delete data[key]
  })

  const changePasswordUrl = new URL(
    '/internal/auth/change',
    identityProviderUrl
  )
  performApiRequest(changePasswordUrl, data)
    .then(
      () => {
        resetInputs()
        if (window.top.location.pathname.startsWith('/reset'))
          window.top.location.href = '/login?reason=reset'
        else showSuccessMessage()
      },
      ({ message }) => showErrorMessage(message)
    )
    .finally(() => form.reset())

  return false
}

window.addEventListener('DOMContentLoaded', () => {
  form.addEventListener('submit', changePassword)
  newPassword.oninput = checkNewPasswordsMatch
  newPasswordAgain.oninput = checkNewPasswordsMatch

  // prefill some optional fields
  if (urlParams.has('email')) {
    email.value = urlParams.get('email')
    email.setAttribute('type', 'hidden')
    email.parentElement.classList.add('hidden')

    // if there is an email it we hide token because it's either
    // supplied or not need (user changing password in settings)
    token.setAttribute('type', 'hidden')
    token.parentElement.classList.add('hidden')
  }

  if (urlParams.has('token')) {
    token.value = urlParams.get('token')
    password.removeAttribute('required')
    password.setAttribute('type', 'hidden')
    password.parentElement.classList.add('hidden')
  }

  requiredInputs.forEach((el) => {
    el.onblur = () => el.classList.add('touched')
  })
})
