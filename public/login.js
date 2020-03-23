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

  window.dispatchEvent(new Event('login-processing'))
  const formData = new FormData(event.target)
  const data = new URLSearchParams(formData)
  const url = new URL('login_check', identityProviderUrl)
  fetch(url, {
    method: 'POST',
    body: data,
    credentials: 'include',
  })
    .then(r => {
      if (r.status === 401) showWrongCredentialsMessage()
    })
    .finally(() => {
      if (window.location !== window.parent.location) {
        // The page is in an iframe
        window.parent.postMessage('login-processing', window.location.origin)
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

  if (urlParams.has('loading')) addLoadingAnimation()

  const form = document.getElementById('login-form')
  form.addEventListener('submit', login)
})

window.addEventListener('login-processing', addLoadingAnimation)
window.addEventListener('login-finished', removeLoadingAnimation)
window.addEventListener('message', handlePostMessage)
