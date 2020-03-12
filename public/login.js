function login(e) {
  e.target.action = `https://api.core.ac.uk/login_check?continue=${encodeURIComponent(
    window.location.origin
  )}`
  window.dispatchEvent(new Event('login-in-processing'))
}

function addLoadingAnimation() {
  const form = document.getElementById('login-form')
  form.classList.add('loading')
}

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('reason')) {
    const message = document.getElementById('error-message')
    message.innerHTML = 'The username or password you entered is incorrect.'
  }

  if (urlParams.has('loading')) addLoadingAnimation()

  const form = document.getElementById('login-form')
  form.addEventListener('submit', login)
})

window.addEventListener('login-in-processing', addLoadingAnimation, false)
