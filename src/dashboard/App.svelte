<script>
  import DateInput from './components/DateInput.svelte'
  // import Chart from './components/Chart.svelte'
  import Dev from './components/Dev.svelte'
  import RangeChooser from './components/RangeChooser.svelte'

  import { onMount } from 'svelte'
  import dayjs from 'dayjs'

  import { data, countInGroup } from './lib'
  import { env } from 'process'

  let top = 20
  let full = 50

  let loading = true
  let init = false
  let counted

  let start
  let end
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
    }, 25)
  })
</script>

<style>
  .top {
    padding: 1em;
    margin: auto;
    width: 100%;
    max-width: 50em;
  }

  .link {
    margin-left: 2em;
  }

  td,
  th {
    padding: 0.25em;
  }

  h3 {
    margin-right: 1em;
  }
</style>

<Dev />
<div class="top rounded">
  <h1 class="text-6xl mb-4">Ora</h1>
  <div class="flex justify-end items-center mb-2">
    <h3>Time Range</h3>
    <RangeChooser bind:start bind:end />
  </div>
  {#if loading}
    <div class="loading loading-lg" />
  {:else if counted}
    <h2 class="text-2xl">Top {top}</h2>
    <b>Chart</b>
    <h2 class="text-2xl mt-4">Top {full}</h2>
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
</div>
