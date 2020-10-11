<script>
  import { onMount } from 'svelte'

  import Chart from '../components/Chart.svelte'
  import RangeChooser from '../components/RangeChooser.svelte'

  import { data, countInGroup } from '../../shared/lib'

  let top = 15
  let full = 100

  let loading = true
  let counted = []
  let table = []
  let timeout

  let start
  let end

  async function calculate() {
    try {
      loading = true
      const logs = await data({
        start,
        end,
      })
      counted = countInGroup(logs)
    } finally {
      loading = false
    }
  }

  $: topData = counted.slice(0, top).map(({ total, host, human }) => ({ value: total, name: host, human }))

  $: {
    start, end
    clearTimeout(timeout)
    timeout = setTimeout(calculate, 5)
  }

  $: {
    let lastHuman = null
    table = counted.map((entry) => {
      const same = lastHuman === entry.human
      if (!same) lastHuman = entry.human
      return {
        ...entry,
        same,
      }
    })
  }

  onMount(calculate)
</script>

<style>
  table td,
  table th {
    padding: 0.25rem 0.06rem;
  }

  table td.same {
    opacity: 0.25;
  }

  table td :global(a:visited) {
    color: inherit;
  }
</style>

<div class="flex justify-between items-center mb-8">
  <h2 class="text-2xl">Dashboard</h2>
  <RangeChooser bind:start bind:end />
</div>
{#if loading}
  <div class="loading loading-lg" />
{:else if counted}
  <h2 class="text-lg">Top {top}</h2>
  <Chart data={topData} />
  <h2 class="text-lg mt-4 mb-2">Top {full}</h2>
  <table class="table">
    <tr>
      <th>Time Spent</th>
      <th>Host</th>
    </tr>
    {#each table.slice(0, full) as { host, total, human, same }}
      <tr>
        <td class:same>{human}</td>
        <td class="link"><a target="_blank" rel="noreferrer" href={'https://' + host}>{host}</a></td>
      </tr>
    {/each}
  </table>
{/if}
