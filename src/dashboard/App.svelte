<script>
  import Router, { link } from 'svelte-spa-router'

  import Dev from './components/Dev.svelte'
  import Dashboard from './pages/Dashboard.svelte'
  import Limits from './pages/Limits.svelte'
  import Footer from '../shared/footer.svelte'

  import { isDev } from '../shared/utils'

  const routes = {
    '/': Dashboard,

    '/limits': Limits,
  }
</script>

<style>
  main {
    padding: 1em;
    margin: auto;
    width: 100%;
    max-width: 50em;
  }
</style>

{#if isDev}
  <Dev />
{/if}
<main>
  <div class="mb-8">
    <a href="../options/index.html"><button class="btn">Options</button></a>
    <a use:link={'/'}><button class="btn">Dashboard</button></a>
    <a use:link={'/limits'}><button class="btn">Limits</button></a>
  </div>

  <Router {routes} />

  <Footer />
</main>
