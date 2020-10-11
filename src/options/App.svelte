<script>
  import { onMount } from 'svelte'
  import browser from 'webextension-polyfill'
  import { saveAs } from 'file-saver'
  import dj from 'dayjs'

  import FileUpload from './FileUpload.svelte'
  import Footer from '../shared/footer.svelte'

  import { dashboard, isDev } from '../shared/utils'
  import { dump as dumpDB, load as loadDB, clear as clearDB, validate } from '../shared/db'
  import { longPress } from '../shared/lib'

  const DEFAULT = {
    retention: 90,
  }

  let settings = DEFAULT
  let uploaded
  let disabled = true

  async function read() {
    settings = {
      ...DEFAULT,
      ...(await browser.storage.local.get()),
    }
  }

  function write() {
    return browser.storage.local.set(settings)
  }

  async function reset() {
    await browser.storage.local.clear()
    await read()
  }

  async function dump() {
    const data = await dumpDB()
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8' })
    const filename = `Ora [${dj().format('YYYY-MM-DD HH-mm-ss')}].json`
    saveAs(blob, filename)
  }

  async function clear() {
    await clearDB()
    alert('Done')
  }

  async function load() {
    try {
      await loadDB(uploaded)
      alert('Imported')
    } catch {
      alert('Error importing')
    }
  }

  $: {
    disabled = !validate(uploaded)
  }

  onMount(read)
</script>

<style>
  main {
    padding: 1em;
    margin: auto;
    width: 100%;
    max-width: 50em;
  }
</style>

<main>
  <a href={dashboard} target={isDev ? '' : '_blank'}><button class="btn">Dashboard</button></a>

  <h2 class="mt-8 text-2xl">Settings</h2>
  <form class="mt-2" on:submit|preventDefault={write}>
    <div class="form-group">
      <label class="form-label">
        Retention
        <small>(Days)</small>
        <input
          id="retention"
          class="form-input"
          type="number"
          min="3"
          max="365"
          step="1"
          bind:value={settings.retention} />
      </label>

      <div class="mt-2">
        <button type="reset" class="btn" on:click={reset}>Reset</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </div>
  </form>
  <h2 class="mt-8 text-2xl">Your Data</h2>
  <div class="mt-2">
    <FileUpload bind:value={uploaded} />
    <button class="btn btn-primary" on:click={load} {disabled}>Import</button>
    <button class="btn btn-primary" on:click={dump}>Export</button>
    <button class="btn btn-error tooltip" data-tooltip="Hold to delete" use:longPress={clear}>Delete all data</button>
  </div>

  <Footer />
</main>
