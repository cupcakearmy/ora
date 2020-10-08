import browser from 'webextension-polyfill'

let wrapper

function init() {
  wrapper = window.document.createElement('div')
  Object.assign(wrapper.style, {
    display: 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#ffffff',
    zIndex: '999999999',
  })
  wrapper.classList.add('ora--wrapper')
  wrapper.classList.add('hidden')

  const inner = window.document.createElement('div')
  Object.assign(inner.style, {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
    margin: '3em auto',
    width: '100%',
    maxWidth: '20em',
  })
  inner.innerHTML = `
    <h1>Overtime ⏱</h1>
    <p>You have no time left on this website 🥺</p>
  `
  wrapper.appendChild(inner)
  window.document.body.appendChild(wrapper)
}

async function check() {
  if (window.document.hidden) return
  const isBlocked = await browser.runtime.sendMessage(window.location.host)
  wrapper.style.display = isBlocked ? 'initial' : 'none'
}

init()
setInterval(check, 5000)
check()
