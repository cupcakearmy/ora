<script>
  import { onMount } from 'svelte'
  import dayjs from 'dayjs'

  const format = 'YYYY-MM-DD'

  export let name = ''

  export let date = new Date()
  let internal

  const input = (x) => (internal = dayjs(x).format(format))
  const output = (x) => (date = dayjs(x, format).toDate())

  $: input(date)
  $: output(internal)
</script>

<style>
  input {
    width: 9em !important;
  }
</style>

<input class="form-input input-sm" type="date" bind:value={internal} {name} />
