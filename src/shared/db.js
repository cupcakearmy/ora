import NeDB from 'nedb-promises'

export const Logs = NeDB.create({
  filename: 'logs.db',
  autoload: true,
})
