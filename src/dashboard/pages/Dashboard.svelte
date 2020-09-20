<script>
  import { onMount } from 'svelte'
  import dayjs from 'dayjs'

  import DateInput from '../components/DateInput.svelte'
  import Chart from '../components/Chart.svelte'
  import RangeChooser from '../components/RangeChooser.svelte'

  import { data, countInGroup } from '../lib'

  let top = 15
  let full = 50

  let loading = true
  let init = false
  let counted = []

  let start
  let end

  async function calculate() {
    try {
      loading = true
      const logs = await data({
        start,
        end: dayjs(end).endOf('day'),
      })
      counted = countInGroup(logs)
    } finally {
      loading = false
    }
  }

  $: if (init) {
    start, end
    calculate()
  }

  $: topData = counted.slice(0, top).map(({ total, host, human }) => ({ value: total, name: host, human }))

  onMount(() => {
    setTimeout(() => {
      init = true
    }, 25)
  })
</script>

<style>
</style>

<div class="flex justify-between items-center mb-4">
  <h2 class="text-2xl">Dashboard</h2>
  <RangeChooser bind:start bind:end />
</div>
{#if loading}
  <div class="loading loading-lg" />
{:else if counted}
  <h2 class="text-lg">Top {top}</h2>
  <Chart data={topData} />
  <h2 class="text-lg mt-4">Top {full}</h2>
  <table class="table">
    <tr>
      <th>Time Spent</th>
      <th>Host</th>
    </tr>
    {#each counted.slice(0, 100) as { host, total, human }}
      <tr>
        <td>{human}</td>
        <td class="link"><a href={'https://' + host}>{host}</a></td>
      </tr>
    {/each}
  </table>
{/if}
