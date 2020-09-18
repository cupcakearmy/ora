<script>
  import { onMount } from 'svelte'
  import dayjs from 'dayjs'

  export let name = ''
  export let date = new Date()
  let internal = dayjs(date).format('YYYY-MM-DD')

  $: date = dayjs(internal, 'YYYY-MM-DD')
</script>

<label class="form-label">{name}<input class="form-input" type="date" bind:value={internal} /> </label>
