<script>
  import DateInput from './components/DateInput.svelte'
  // import Chart from './components/Chart.svelte'
  import Dev from './components/Dev.svelte'
  import RangeChooser from './components/RangeChooser.svelte'

  import { onMount } from 'svelte'
  import dayjs from 'dayjs'

  import { data, countInGroup } from './lib'
  import { env } from 'process'

  let loading = true
  let init = false
  let counted
  let top = 20
  let start = dayjs().subtract(3, 'days').toDate()
  let end = new Date()
  let topData = {
    labels: [],
    data: [],
  }

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
    // const onlyTop = counted.slice(0, top)
    // console.log(onlyTop)
    // topData = {
    //   labels: onlyTop.map((n) => n[0]),
    //   data: onlyTop.map((n) => n[1] / 1000),
    // }
  }

  $: if (init) {
    start, end
    calculate()
  }

  onMount(() => {
    setTimeout(() => {
      init = true
      // calculate()
    }, 250)
  })
</script>

<style>
  .top {
    padding: 1em;
    margin: auto;
    width: 100%;
    max-width: 50em;
  }

  /* .date > .spacer {
    width: 1em;
  } */

  .link {
    margin-left: 2em;
  }

  td,
  th {
    padding: 0.25em;
  }
</style>

<Dev />
<div class="top rounded">
  <div class="flex justify-between items-center">
    <h2 class="text-4xl">Top {top}</h2>
    <RangeChooser bind:start bind:end />
  </div>
  {#if loading}
    <div class="loading loading-lg" />
  {:else if counted}
    <table class="table">
      <tr>
        <th>Time Spent</th>
        <th>Host</th>
      </tr>
      {#each counted as { host, total, human }}
        <tr>
          <td>{human}</td>
          <td class="link"><a href={'https://' + host}>{host}</a></td>
        </tr>
      {/each}
    </table>
  {/if}
</div>
