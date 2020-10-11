import browser from 'webextension-polyfill'
import dayjs from 'dayjs'

import { dashboard } from '../shared/utils'
import { insertLog, normalizeTimestamp, Limits, DB } from '../shared/db'
import { getUsageForHost, percentagesToBool } from '../shared/lib'

browser.browserAction.onClicked.addListener(() => browser.tabs.create({ url: dashboard, active: true }))

const frequency = 1000

async function log() {
  try {
    const tabs = await browser.tabs.query({})
    const windows = await browser.windows.getAll()
    const active = tabs
      .filter((tab) => {
        const window = windows.find((window) => window.id === tab.windowId)
        return tab.active && window.focused
      })
      .map(({ id, title, url }) => {
        const { host } = new URL(url)
        return { id, title, host }
      })

    await Promise.all(
      active.map(({ host }) => {
        if (host)
          return insertLog({
            timestamp: normalizeTimestamp(new Date()),
            host,
            seconds: (frequency / 1000) | 0,
          })
      })
    )
  } catch {}
}

async function deleteOldLogs() {
  const { retention } = await browser.storage.local.get()
  const maxAge = dayjs().startOf('day').subtract(retention, 'days').toDate()
  const toDelete = await DB.logs.where('timestamp').below(maxAge).toArray()
  const ids = toDelete.map((log) => log.id)
  await DB.logs.bulkDelete(ids)
}

setInterval(deleteOldLogs, 5 * 60 * 1000) // Delete old logs every 5 minutes
setInterval(log, frequency)

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  return getUsageForHost(message).then((percentages) => percentagesToBool(percentages))
})
