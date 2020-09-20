import NeDB from 'nedb-promises'
import dj from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import Duration from 'dayjs/plugin/duration'

dj.extend(Duration)
dj.extend(RelativeTime)

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
  const t = dj(timestamp)
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
