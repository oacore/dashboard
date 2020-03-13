function login(event) {
  event.preventDefault()
  window.dispatchEvent(new Event('login-processing'))
  const formData = new FormData(event.target)
  const data = new URLSearchParams(formData)
  fetch('https://api.dev.core.ac.uk/login_check', {
    method: 'POST',
    body: data,
    credentials: 'include',
  }).finally(() => {
    if (window.location !== window.parent.location) {
      // The page is in an iframe
      window.parent.postMessage('login-processing', window.location.origin)
    } else window.location = '/'
  })

  return false
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

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('reason')) {
    const message = document.getElementById('error-message')
    message.innerHTML = 'The username or password you entered is incorrect.'
  }

  if (urlParams.has('logout')) {
    const message = document.getElementById('info-message')
    message.innerHTML = 'You have been successfully logged out. Log in again.'
  }

  if (urlParams.has('loading')) addLoadingAnimation()

  const form = document.getElementById('login-form')
  form.addEventListener('submit', login)
})

window.addEventListener('login-processing', addLoadingAnimation)
window.addEventListener('login-finished', removeLoadingAnimation)
window.addEventListener('message', handlePostMessage)
