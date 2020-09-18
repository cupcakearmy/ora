<script>
  import DateInput from './components/Date.svelte'
  import Chart from './components/Chart.svelte'
  import Dev from './components/Dev.svelte'

  import { onMount } from 'svelte'
  import dayjs from 'dayjs'
  import { Duration } from 'uhrwerk'

  import { data, countInGroup } from './lib'
  import { env } from 'process'

  let counted
  let top = 20
  let start = dayjs().subtract(3, 'days').toDate()
  let end = new Date()
  let topData = {
    labels: [],
    data: [],
  }

  async function calculate() {
    console.log('Calculating')
    const logs = await data({
      start,
      end: dayjs(end).endOf('day'),
    })
    counted = countInGroup(logs)
    // const onlyTop = counted.slice(0, top)
    // console.log(onlyTop)
    // topData = {
    //   labels: onlyTop.map((n) => n[0]),
    //   data: onlyTop.map((n) => n[1] / 1000),
    // }
  }

  $: {
    start, end
    calculate()
  }

  onMount(() => {
    calculate()
  })
</script>

<style>
  .top {
    padding: 1em;
    margin: auto;
    width: 100%;
    max-width: 50em;
  }

  .date > .spacer {
    width: 1em;
  }

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
    <div class="date flex px-1 rounded">
      <DateInput bind:date={start} />
      <div class="spacer" />
      <DateInput bind:date={end} />
    </div>
  </div>
  {#if counted}
    <Chart data={counted.slice(0, top)} />
    <table>
      <tr>
        <th>Time Spent</th>
        <th>Host</th>
      </tr>
      {#each counted as { host, total, human }}
        <tr>
          <td><b>{human}</b></td>
          <td class="link"><a href={'https://' + host}>{host}</a></td>
        </tr>
      {/each}
    </table>
  {/if}
</div>
