<script>
  import faker from 'faker'
  import day from 'dayjs'
  import { range, random } from 'lodash'

  import { insertLog, normalizeTimestamp, clear as clearDB } from '../../shared/db'

  let loading = false

  async function fill() {
    try {
      loading = true
      const start = day().subtract('7', 'days').valueOf()
      const end = Date.now()
      for (const n of range(20)) {
        const host = faker.internet.domainName()
        for (const m of range(random(20))) {
          const date = new Date(random(start, end))
          const timestamp = normalizeTimestamp(date)
          const seconds = random(15 * 60)
          // console.log(host, date, seconds)
          await insertLog({ host, timestamp, seconds })
        }
      }
    } finally {
      loading = false
    }
  }

  async function clear() {
    try {
      loading = true
      await clearDB()
    } finally {
      loading = false
    }
  }
</script>

<style>
  div {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>

<div class="p-2">
  <button class="btn btn-sm" class:loading disabled={loading} on:click={fill}>Add Random Data</button>
  <button class="btn btn-sm btn-error" class:loading disabled={loading} on:click={clear}>Delete data</button>
</div>
