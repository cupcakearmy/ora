import dj from 'dayjs'
import Dexie from 'dexie'
import RelativeTime from 'dayjs/plugin/relativeTime'
import Duration from 'dayjs/plugin/duration'
import Joi from 'joi'

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

export async function clear() {
  await DB.limits.clear()
  await DB.logs.clear()
}

export async function dump() {
  return {
    limits: await DB.limits.toArray(),
    logs: await DB.logs.toArray(),
  }
}

export function validate(data) {
  const schema = Joi.object({
    limits: Joi.array().items(
      Joi.object({
        host: Joi.string(),
        id: Joi.number(),
        rules: Joi.array().items(
          Joi.object({
            limit: Joi.array().items(Joi.string(), Joi.number()),
            every: Joi.array().items(Joi.string(), Joi.number()),
          })
        ),
      })
    ),
    logs: Joi.array().items(
      Joi.object({
        host: Joi.string(),
        id: Joi.number(),
        seconds: Joi.number(),
        timestamp: Joi.string(),
      })
    ),
  })

  const validated = schema.validate(data, { presence: 'required' })
  return !validated.error
}

export async function load(data) {
  if (!validate(data)) throw new Error('Invalid data')

  await clear()
  await DB.limits.bulkAdd(data.limits)
  await DB.logs.bulkAdd(
    data.logs.map((log) => ({
      ...log,
      timestamp: new Date(log.timestamp),
    }))
  )
}
