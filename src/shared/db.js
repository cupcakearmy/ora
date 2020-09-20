import NeDB from 'nedb-promises'
import day from 'dayjs'

export const Logs = NeDB.create({
  filename: 'logs.db',
  autoload: true,
})

export const Limits = NeDB.create({
  filename: 'limits.db',
  autoload: true,
})

export function clear() {
  return Promise.all([Logs.remove({}, { multi: true }), Limits.remove({}, { multi: true })])
}

export function normalizeTimestamp(timestamp) {
  // Normalize every dato to 15 minutes
  const t = day(timestamp)
  const min = t.minute()
  return t
    .millisecond(0)
    .second(0)
    .minute(min - (min % 15))
    .toDate()
}

export async function insertLog({ timestamp, host, seconds }) {
  Logs.update(
    {
      host,
      timestamp,
    },
    { $inc: { seconds } },
    { upsert: true }
  )
}
