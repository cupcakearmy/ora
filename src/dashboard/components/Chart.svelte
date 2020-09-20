<script>
  import * as d3 from 'd3'
  import { map, min, max } from 'lodash'
  import { onMount } from 'svelte'

  let wrapper

  export let data = [
    // { lang: 'ts', popularity: 10 },
    // { lang: 'js', popularity: 7 },
    // { lang: 'py', popularity: 9 },
    // { lang: 'rs', popularity: 8 },

    // { year: 2018, value: 8 },
    // { year: 2019, value: 9 },
    // { year: 2020, value: 3 },

    { cat: 'Phillip', value: 10 },
    { cat: 'Rita', value: 12 },
    { cat: 'Tom', value: 20 },
    { cat: 'Oscar', value: 19 },
    { cat: 'Lulu', value: 8 },
    { cat: 'Keko', value: 14 },
    { cat: 'Lena', value: 9 },
  ]

  onMount(async () => {
    // Dynamic left padding depending on the labels
    const longestKey = max(map(data, (d) => d.name.length))
    const mt = Math.min(longestKey * 6, 120)
    const margin = { left: mt, top: 50, bottom: 50, right: 50 }
    const styles = window.getComputedStyle(wrapper)
    const barHeight = 20
    const width = parseInt(styles.width)
    const height = Math.ceil(data.length * 1.5 * barHeight)

    const svg = d3.select(wrapper).attr('viewBox', [0, 0, width, height])

    const yAxis = (g) =>
      g.attr('transform', `translate(${margin.left},0)`).call(
        d3
          .axisLeft(y)
          .tickFormat((i) => data[i].name)
          .tickSizeOuter(0)
      )
    const xAxis = (g) =>
      g
        .attr('transform', `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 100, 's'))
        .call((g) => g.select('.domain').remove())

    const y = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .rangeRound([margin.bottom, height - margin.top])
      .padding(0.2)
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([margin.left, width - margin.right])

    const format = x.tickFormat(20, 's')

    // Bars
    svg
      .append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', x(0))
      .attr('y', (d, i) => y(i))
      .attr('width', (d) => x(d.value) - x(0))
      .attr('height', y.bandwidth())

    svg
      .append('g')
      .attr('fill', 'white')
      .attr('text-anchor', 'end')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .selectAll('text')
      .data(data)
      .join('text')
      .attr('x', (d) => x(d.value))
      .attr('y', (d, i) => y(i) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('dx', -4)
      .text((d) => d.human)
      .call((text) =>
        text
          .filter((d) => x(d.value) - x(0) < d.human.length * 7) // short bars
          .attr('dx', +4)
          .attr('fill', 'black')
          .attr('text-anchor', 'start')
      )

    svg.append('g').call(xAxis)

    svg.append('g').call(yAxis)
  })
</script>

<style>
  svg {
    width: 100%;
    /* height: 25em; */
  }
</style>

<svg bind:this={wrapper} preserveAspectRatio="xMidYMid meet" />
