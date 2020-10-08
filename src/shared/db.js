import dj from 'dayjs'
import Dexie from 'dexie'
import RelativeTime from 'dayjs/plugin/relativeTime'
import Duration from 'dayjs/plugin/duration'

dj.extend(Duration)
dj.extend(RelativeTime)

export const DB = new Dexie('ora')
DB.version(2).stores({
  logs: `++id, host, timestamp`,
  limits: `++id, host`,
})

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
  const saved = await DB.logs.where({ host, timestamp }).first()
  const data = Object.assign({ host, timestamp, seconds: 0 }, saved)
  data.seconds += seconds
  await DB.logs.put(data)
}
