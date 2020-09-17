import browser from 'webextension-polyfill'
// import Dexie from 'dexie'

// const db = new Dexie('myDb')
// db.version(1).stores({
//   friends: `name, age`,
// })

// import NeDB from 'nedb'

// const db = new NeDB({filename: 'data.db'})
// db.insert({planet: 'Earth'})
import NeDB from 'nedb-promises'

const db = NeDB.create({
  filename: 'data.db',
  autoload: true,
})

async function main() {
  await db.insert({ planet: 'Earth' })
  console.log('Docs', await db.find())
}
// main()

async function getAllTabs() {
  console.log('Getting all tabs')
  const all = await browser.tabs.query({})
  for (const tab of all) {
    console.log(tab.title, tab.id, tab.active, tab.highlighted)
  }
}

setInterval(() => {
  getAllTabs()
}, 10000)

// document.addEventListener('DOMContentLoaded', () => {
//   console.log('Hello from BG')
// })
