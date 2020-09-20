<script>
  import dj from 'dayjs'
  import { sum } from 'lodash'

  import { Logs } from '../../shared/db.js'
  import { getLogsBetweenDates } from '../lib.js'

  export let host = ''
  export let rules = []

  $: percentages = rules.map(async ({ every }) => {
    const durationAsSeconds = dj.duration(...every).asSeconds()
    const start = dj().subtract(durationAsSeconds, 's').toDate()
    console.log(start)
    const logs = await getLogsBetweenDates({
      start,
      end: new Date(),
      host,
    })
    console.log(logs)

    const consumed = sum(logs.map((log) => log.seconds))
    return (consumed / durationAsSeconds) * 100
    console.log(total, dj.duration(total, 's').humanize())
  })
</script>

{#each rules as rule, i}
  <div>{dj.duration(...rule.limit).humanize()} / {dj.duration(...rule.every).humanize()}</div>
  {#await percentages[i]}
    loading
  {:then percentage}
    <div class="bar bar-sm mb-2">
      <div
        class="bar-item"
        role="progressbar"
        style={`width:${percentage}%;`}
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100" />
    </div>
  {/await}
{/each}
