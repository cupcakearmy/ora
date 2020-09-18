<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_frozen from '@amcharts/amcharts4/themes/frozen'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'
  import { onMount } from 'svelte'

  /* Chart code */
  // Themes begin
  am4core.useTheme(am4themes_frozen)
  am4core.useTheme(am4themes_animated)

  let el
  let chart

  export let data = [
    {
      network: 'Facebook',
      MAU: 2255250000,
    },
    {
      network: 'Google+',
      MAU: 430000000,
    },
    {
      network: 'Instagram',
      MAU: 1000000000,
    },
    {
      network: 'Pinterest',
      MAU: 246500000,
    },
    {
      network: 'Reddit',
      MAU: 355000000,
    },
    {
      network: 'TikTok',
      MAU: 500000000,
    },
    {
      network: 'Tumblr',
      MAU: 624000000,
    },
    {
      network: 'Twitter',
      MAU: 329500000,
    },
    {
      network: 'WeChat',
      MAU: 1000000000,
    },
    {
      network: 'Weibo',
      MAU: 431000000,
    },
    {
      network: 'Whatsapp',
      MAU: 1433333333,
    },
    {
      network: 'YouTube',
      MAU: 1900000000,
    },
  ]

  $: if (chart) {
    chart.data = data
  }

  onMount(() => {
    chart = am4core.create(el, am4charts.XYChart)

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
    categoryAxis.renderer.grid.template.location = 0
    categoryAxis.dataFields.category = 'host'
    categoryAxis.renderer.minGridDistance = 1
    categoryAxis.renderer.inversed = true
    categoryAxis.renderer.grid.template.disabled = true

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis())
    valueAxis.min = 0

    let series = chart.series.push(new am4charts.ColumnSeries())
    series.dataFields.categoryY = 'host'
    series.dataFields.valueX = 'total'
    series.columns.template.strokeOpacity = 0
    series.columns.template.column.cornerRadiusBottomRight = 5
    series.columns.template.column.cornerRadiusTopRight = 5

    let labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = 'left'
    labelBullet.label.dx = 10
    labelBullet.label.text = '{values.valueX.workingValue}'
    // labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}"
    labelBullet.locationX = 1

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add('fill', function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index)
    })

    categoryAxis.sortBySeries = series
    chart.data = data
  })
</script>

<style>
  div {
    width: 100%;
    height: 32em;
  }
</style>

<div bind:this={el}>chart</div>
