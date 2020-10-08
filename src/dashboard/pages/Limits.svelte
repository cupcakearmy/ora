<script>
  import { onMount } from 'svelte'

  import RulesEditor from '../components/RulesEditor.svelte'
  import Rules from '../components/Rules.svelte'

  import { DB } from '../../shared/db.js'
  import { longPress } from '../../shared/lib'

  let limits = null
  let limit = null

  function create() {
    limit = { host: '', rules: [] }
  }

  function edit(id) {
    limit = limits.find((limit) => limit.id === id)
  }

  async function load() {
    limits = await DB.limits.toArray()
  }

  async function del(id) {
    await DB.limits.delete(id)
    await load()
  }

  onMount(load)
</script>

<style>
  td {
    vertical-align: top;
  }
</style>

<RulesEditor bind:limit on:update={load} />

<div class="flex justify-between items-center mb-4">
  <h2 class="text-2xl">Limits</h2>
  <button class="btn btn-primary" on:click={create}>New Rule</button>
</div>

{#if Array.isArray(limits)}
  <table class="table">
    <tr>
      <th class="w-32">Host</th>
      <th>Rules</th>
      <th class="text-right w-32">Actions</th>
    </tr>
    {#each limits as { host, rules, id }}
      <tr>
        <td>{host}</td>
        <td>
          <Rules {rules} {host} />
        </td>
        <td class="text-right">
          <div class="btn-group">
            <button class="btn btn-sm btn-primary" on:click={() => edit(id)}>Edit</button>
            <button class="btn btn-sm btn-error tooltip" data-tooltip="Hold to delete" use:longPress={() => del(id)}>
              Delete
            </button>
          </div>
        </td>
      </tr>
    {/each}
  </table>
{:else}
  <div class="loading loading-lg" />
{/if}
