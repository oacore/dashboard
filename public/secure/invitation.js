// eslint-disable-next-line max-classes-per-file
class UnauthorisedError extends Error {}
class WrongInputError extends Error {}
class InvitationCodeInvalid extends Error {}
class InvitationCodeAlreadyUsed extends Error {}

const urlParams = new URLSearchParams(window.location.search)
const email = document.getElementById('email')
const invitationCode = document.getElementById('invitationCode')
const form = document.getElementById('registration-form')
const requiredInputs = form.querySelectorAll('[required]')
const password = document.getElementById('password')
const passwordAgain = document.getElementById('passwordAgain')

function performApiRequest(url, data) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  }).then((response) => {
    if (response.status === 401) {
      window.top.location.href = '/login?reason=logout'
      throw new UnauthorisedError('Wrong credentials')
    }

    if (response.status === 406)
      throw new InvitationCodeInvalid('Invitation code is invalid.')

    if (response.status === 409) {
      throw new InvitationCodeAlreadyUsed(
        'Seem like you have registered already. Please try to log in.'
      )
    }

    if (response.status !== 201)
      throw new WrongInputError('Registration error. Please try it again!')

    return response
  })
}

function showErrorMessage(message) {
  const messageEl = document.getElementById('message')
  messageEl.innerHTML = message
  messageEl.classList.add('success')
  messageEl.classList.add('danger')
}

function checkNewPasswordsMatch() {
  if (password.value !== passwordAgain.value)
    passwordAgain.setCustomValidity('Passwords must match.')
  else passwordAgain.setCustomValidity('')
}

function prefillOptionalFields() {
  // prefill some optional fields
  if (urlParams.has('email')) {
    email.value = urlParams.get('email')
    email.setAttribute('readonly', 'true')
  }

  if (urlParams.has('invitationCode')) {
    invitationCode.value = urlParams.get('invitationCode')
    invitationCode.setAttribute('readonly', 'true')
    invitationCode.setAttribute('type', 'hidden')
    invitationCode.parentElement.classList.add('hidden')
  }
}

function registerUser(event) {
  event.preventDefault()

  const identityProviderUrl =
    urlParams.get('identity_provider_url') || 'https://api.core.ac.uk/'

  const formData = new FormData(event.target)
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    invitationCode: formData.get('invitationCode'),
  }

  // remove empty params
  Object.entries(data).forEach(([key, value]) => {
    if (!value) delete data[key]
  })

  const registerUrl = new URL('/internal/auth/register', identityProviderUrl)
  performApiRequest(registerUrl, data)
    .then(
      () => {
        window.top.location.href = '/login?reason=registration'
      },
      ({ message }) => showErrorMessage(message)
    )
    .finally(() => {
      form.reset()
      prefillOptionalFields()
    })

  return false
}

window.addEventListener('DOMContentLoaded', () => {
  form.addEventListener('submit', registerUser)
  password.oninput = checkNewPasswordsMatch
  passwordAgain.oninput = checkNewPasswordsMatch

  prefillOptionalFields()

  requiredInputs.forEach((el) => {
    el.onblur = () => el.classList.add('touched')
  })
})
