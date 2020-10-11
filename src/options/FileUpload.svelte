<script>
  import { isEqual } from 'lodash'

  let text = 'Select File'

  export let value = undefined

  let input
  let error

  function validate() {
    if (!input || !input.files.length) return

    const file = input.files[0]
    text = file.name

    const reader = new FileReader()
    reader.onload = (data) => {
      try {
        error = false
        const text = data.target.result
        const parsed = JSON.parse(text)
        value = parsed
      } catch {
        error = true
        value = undefined
      }
    }
    reader.readAsText(file)
  }
</script>

<style>
  label {
    width: 18em;
    max-width: 100%;
    display: inline-block;
  }
  label input[type='file'] {
    display: none;
  }
</style>

<label class="btn">
  {#if error}Invalid file{:else}{text}{/if}
  <input bind:this={input} on:change={validate} class="input" accept="application/json" type="file" />
</label>
