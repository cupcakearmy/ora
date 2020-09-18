<script>
  import faker from 'faker'
  import day from 'dayjs'
  import { range, random } from 'lodash'

  import { Logs } from '../../shared/db'

  let loading = false

  async function fill() {
    try {
      loading = true

      const start = day().subtract('7', 'days').valueOf()
      const end = Date.now()

      const all = []
      for (const n of range(50)) {
        const host = faker.internet.domainName()
        for (const m of range(random(500))) {
          const frequency = random(1, 10) * 1000
          const timestamp = new Date(random(start, end))
          all.push({ host, timestamp, frequency })
        }
      }
      console.log(`Generated ${all.length} data points`)
      console.debug(all)
      await Logs.insert(all)
    } finally {
      loading = false
    }
  }

  async function clear() {
    try {
      loading = true
      await Logs.remove({}, { multi: true })
    } finally {
      loading = false
    }
  }
</script>

<div class="p-2">
  <button class="btn" class:loading disabled={loading} on:click={fill}>Add Random Data</button>
  <button class="btn btn-error" class:loading disabled={loading} on:click={clear}>Delete data</button>
</div>
