<script>
  import { onMount } from 'svelte'

  import Chart from 'chart.js'
  import palette from 'google-palette'

  Chart.defaults.global.legend.display = false

  export let type = 'horizontalBar'
  export let data = {
    labels: [],
    data: [],
  }
  export let options = {
    scales: {
      xAxes: [
        {
          // type: 'logarithmic',
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  let ctx
  let mounted

  function draw() {
    const backgroundColor = palette('rainbow', data.data.length).map((color) => '#' + color + '88')

    new Chart(ctx, {
      type,
      options,
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.data,
            // backgroundColor: backgroundColor,
            backgroundColor: '#dddddd',
            borderColor: '#000000',
            borderWidth: 1,
          },
        ],
      },
    })
  }

  $: if (mounted) {
    data
    draw()
  }

  onMount(() => {
    mounted = true
  })
</script>

<style>
  canvas {
    width: 100%;
    height: 20em;
  }
</style>

<canvas bind:this={ctx} />
