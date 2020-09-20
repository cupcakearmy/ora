<script>
  import dj from 'dayjs'
  import { Logs } from '../../shared/db.js'

  export let rules = []
</script>

{#each rules as rule}
  <div>{dj.duration(...rule.limit).humanize()} / {dj.duration(...rule.every).humanize()}</div>
{/each}
