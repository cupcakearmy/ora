<script>
  import { onMount } from 'svelte'

  import RulesEditor from '../components/RulesEditor.svelte'
  import Rules from '../components/Rules.svelte'

  import { Limits } from '../../shared/db.js'
  import { longPress } from '../lib'

  let limits = null
  let limit = null

  function create() {
    limit = { host: '', rules: [] }
  }

  function edit(id) {
    limit = limits.find((limit) => limit._id === id)
  }

  async function load() {
    limits = await Limits.find()
  }

  async function del(id) {
    await Limits.remove({ _id: id })
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
      <th>Host</th>
      <th>Rules</th>
      <th class="text-right">Actions</th>
    </tr>
    {#each limits as { host, rules, _id }}
      <tr>
        <td>{host}</td>
        <td>
          <Rules {rules} />
        </td>
        <td class="text-right">
          <div class="btn-group">
            <button class="btn btn-sm btn-primary" on:click={() => edit(_id)}>Edit</button>
            <button class="btn btn-sm btn-error tooltip" data-tooltip="Hold to delete" use:longPress={() => del(_id)}>
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
