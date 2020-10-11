<script>
  import * as d3 from 'd3'
  import { map, max } from 'lodash'
  import { onMount } from 'svelte'

  let wrapper

  export let data = []

  function render() {
    if (!wrapper) return

    // Dynamic left padding depending on the labels
    const longestKey = max(map(data, (d) => d.name.length))
    const baseMargin = 35
    const ml = Math.min(longestKey * 6.3, 120) + baseMargin
    const margin = { left: ml, top: baseMargin, bottom: baseMargin, right: baseMargin }
    const styles = window.getComputedStyle(wrapper)
    const barHeight = 20
    const width = parseInt(styles.width)
    const height = Math.ceil(data.length * 1.25 * barHeight + (margin.top + margin.bottom))

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
      .attr('fill', '#17bbac')
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
          .filter((d) => x(d.value) - x(0) < d.human.length * 8) // short bars
          .attr('dx', +4)
          .attr('fill', 'black')
          .attr('text-anchor', 'start')
      )

    svg.append('g').call(xAxis)

    svg.append('g').call(yAxis)
  }

  onMount(render)
</script>

<style>
  svg {
    width: 100%;
  }

  svg :global(*) {
    font-family: monospace;
  }
</style>

<svg bind:this={wrapper} preserveAspectRatio="xMidYMid meet" />
