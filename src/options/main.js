import browser from 'webextension-polyfill'

const DEFAULT = {
  frequency: 3,
  retention: 90,
}

async function load() {
  try {
    return await browser.storage.local.get()
  } catch {
    return DEFAULT
  }
}

async function save(settings) {
  return browser.storage.local.set(settings)
}

function init() {
  const frequency = window.document.getElementById('frequency')
  const retention = window.document.getElementById('retention')
  const reset = window.document.getElementById('reset')
  const form = window.document.getElementById('form')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    save({ frequency: frequency.value, retention: retention.value })
  })

  reset.addEventListener('click', async () => {
    await browser.storage.local.clear()
    window.location.reload()
  })

  load().then((saved) => {
    frequency.value = saved.frequency
    retention.value = saved.retention
  })
}

window.document.addEventListener('DOMContentLoaded', init)
