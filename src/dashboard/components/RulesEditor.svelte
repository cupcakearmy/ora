<script>
  import { createEventDispatcher } from 'svelte'
  import { cloneDeep } from 'lodash'

  import { Limits } from '../../shared/db'

  const dispatch = createEventDispatcher()
  const init = { limit: ['1', 'h'], every: [1, 'd'] }

  export let limit = null
  $: active = limit !== null

  function add() {
    limit.rules = [...limit.rules, cloneDeep(init)]
  }

  function del(i) {
    return () => (limit.rules = limit.rules.filter((_, n) => n !== i))
  }

  function close() {
    limit = null
  }

  async function save() {
    await Limits.update({ host: limit.host }, limit, { upsert: true })
    dispatch('update')
    close()
  }
</script>

<div class:active class="modal">
  <a on:click={close} class="modal-overlay" aria-label="Close" />
  <div class="modal-container">
    <div class="modal-header">
      <a on:click={close} class="btn btn-clear float-right" aria-label="Close" />
      <div class="modal-title h5">{limit?._id ? 'Edit limit' : 'Create new limit'}</div>
    </div>
    <div class="modal-body">
      <div class="content">
        {#if limit}
          <label class="form-label">
            Host <input type="text" class="form-input" placeholder="google.com" bind:value={limit.host} />
          </label>

          <div class="form-label">Rules</div>
          {#each limit.rules as { limit, every }, i}
            <div class="input-group mb-3">
              <input type="text" class="form-input" placeholder="1" bind:value={limit[0]} />
              <select class="form-select" bind:value={limit[1]}>
                <option value="m">Minutes</option>
                <option value="h">Hours</option>
                <option value="d">Days</option>
                <option value="w">Weeks</option>
                <option value="M">Months</option>
              </select>
              <span class="input-group-addon">every</span>
              <input type="text" class="form-input" bind:value={every[0]} />
              <select class="form-select" bind:value={every[1]}>
                <option value="m">Minutes</option>
                <option value="h">Hours</option>
                <option value="d">Days</option>
                <option value="w">Weeks</option>
                <option value="M">Months</option>
              </select>
              <button class="btn btn-error input-group-btn" on:click={del(i)}>X</button>
            </div>
          {/each}
          <button class="btn" on:click={add}>Add</button>
        {/if}
      </div>
    </div>
    <div class="modal-footer">
      <div>
        <button on:click={close} class="btn">Cancel</button>
        <button on:click={save} class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>
