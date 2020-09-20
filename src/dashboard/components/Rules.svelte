<script>
  import dj from 'dayjs'

  import { getUsageForRules } from '../lib.js'

  export let host = ''
  export let rules = []

  $: percentages = getUsageForRules(host, rules)
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
