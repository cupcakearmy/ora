import { groupBy, orderBy, sum } from 'lodash'
import dj from 'dayjs'

import { Logs } from '../shared/db'

export async function data({ start, end }) {
  const logs = await getLogsBetweenDates({ start, end })
  return groupBy(logs, 'host')
}

export async function getLogsBetweenDates({ start, end, host }) {
  const where = {
    $and: [{ timestamp: { $gt: start } }, { timestamp: { $lt: end } }],
  }
  if (host) where.host = host
  return await Logs.find(where)
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
