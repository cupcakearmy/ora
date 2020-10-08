import { groupBy, orderBy, sum } from 'lodash'
import dj from 'dayjs'

import { DB } from './db.js'

export async function data({ start, end }) {
  const logs = await getLogsBetweenDates({ start, end })
  return groupBy(logs, 'host')
}

export async function getLogsBetweenDates({ start, end, host }) {
  let query = DB.logs.where('timestamp').inAnyRange([[start, end]])
  if (host) query = query.filter((x) => x.host === host)
  return await query.toArray()
}

export function countInGroup(grouped) {
  const counted = Object.entries(grouped).map(([key, data]) => {
    const total = data.reduce((acc, cur) => acc + cur.seconds, 0)
    const human = dj.duration(total, 'seconds').humanize()
    return {
      host: key,
      total,
      human,
    }
  })
  return orderBy(counted, 'total', 'desc')
}

export function longPress(node, fn) {
  let timeout
  node.addEventListener('mousedown', () => (timeout = setTimeout(fn, 500)), false)
  node.addEventListener('mouseup', () => clearTimeout(timeout), false)
}

export function getUsageForRules(host, rules) {
  return rules.map(async ({ every, limit }) => {
    const limitAsSeconds = dj.duration(...limit).asSeconds()
    const everyAsSeconds = dj.duration(...every).asSeconds()

    const logs = await getLogsBetweenDates({
      start: dj().subtract(everyAsSeconds, 's').toDate(),
      end: new Date(),
      host,
    })

    // Calculate usage in percentage 0-100
    const consumed = sum(logs.map((log) => log.seconds))
    return (consumed / limitAsSeconds) * 100
  })
}

export async function getUsageForHost(host) {
  const limit = await DB.limits.where({ host }).first()
  return await Promise.all(getUsageForRules(host, limit.rules))
}

export function percentagesToBool(percentages) {
  const blocked = percentages.map((p) => p >= 100).includes(true)
  return blocked
}
