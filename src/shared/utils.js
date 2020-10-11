import browser from 'webextension-polyfill'

export const dashboard = browser.runtime.getURL('./src/dashboard/index.html')

export const isDev = process.env.NODE_ENV !== 'production'
