import { each, groupBy, orderBy } from 'lodash'
import dj from 'dayjs'

import { Logs } from '../shared/db'

export async function data({ start, end }) {
  const logs = await getLogsBetweenDates({ start, end })
  console.log('Found', logs.length)
  return groupBy(logs, 'host')
}

export async function getLogsBetweenDates({ start, end }) {
  return await Logs.find({
    $and: [{ timestamp: { $gt: start } }, { timestamp: { $lt: end } }],
  })
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
