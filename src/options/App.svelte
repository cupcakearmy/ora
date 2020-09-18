<script>
  import { onMount } from 'svelte'
  import browser from 'webextension-polyfill'

  import { dashboard } from '../shared/utils'

  const DEFAULT = {
    retention: 90,
  }

  let settings = DEFAULT

  onMount(async () => {
    load()
  })

  async function load() {
    settings = {
      ...DEFAULT,
      ...(await browser.storage.local.get()),
    }
  }

  function save() {
    return browser.storage.local.set(settings)
  }

  async function reset() {
    await browser.storage.local.clear()
    await load()
  }
</script>

<main class="p-4">
  <a href={dashboard} target="_blank"><button class="btn btn-primary btn-lg">Dashboard</button></a>

  <form class="max-w-sm mt-5" on:submit|preventDefault={save}>
    <div class="form-group">
      <label class="form-label">
        Retention <small>(Days)</small>
        <input
          id="retention"
          class="form-input"
          type="number"
          min="3"
          max="365"
          step="1"
          bind:value={settings.retention} />
      </label>
      <button type="reset" class="btn" on:click={reset}>Reset</button>
      <button type="submit" class="btn btn-primary">Save</button>
    </div>
  </form>
</main>
