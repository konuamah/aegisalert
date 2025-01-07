<script lang="ts">
  import { onMount } from 'svelte';
  import { user, logout } from '$lib/stores/authStore';
  import { fade, fly } from 'svelte/transition';

  let isMenuOpen: boolean = false;
  let isLoading: boolean = true;

  interface User {
    id: string;
    name: string;
    email: string;
  }

  async function checkAuthStatus(): Promise<void> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated check
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      isLoading = false;
    }
  }

  async function handleLogout(): Promise<void> {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  onMount(() => {
    checkAuthStatus();
  });
</script>

<header class="bg-[#548181] p-4 flex justify-between items-center" style="color: #fff5ed;">
  <h1 class="text-2xl font-bold">Aegis Alert</h1>

  <button
    class="md:hidden p-2 focus:outline-none"
    on:click={() => (isMenuOpen = !isMenuOpen)}
    aria-label="Toggle Menu"
  >
    <svg
      class="w-6 h-6 transition-transform duration-300"
      class:rotate-90={isMenuOpen}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
      ></path>
    </svg>
  </button>

  <nav
    class="md:flex md:items-center md:space-x-4 absolute md:static top-16 left-0 w-full md:w-auto bg-[#548181] md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out"
    class:hidden={!isMenuOpen}
    class:block={isMenuOpen}
    in:fly={{ y: -20, duration: 300 }}
    out:fade
  >
    <a href="/" class="block md:inline-block mx-2 hover:underline hover:text-[#f9ebde] transition-colors duration-200">Home</a>
    <a href="/alerts" class="block md:inline-block mx-2 hover:underline hover:text-[#f9ebde] transition-colors duration-200">Alerts</a>

    {#if isLoading}
      <div class="block md:inline-block mx-2">Loading...</div>
    {:else if $user}
      <a href="/profile">Profile</a>
      <button on:click={handleLogout} class="cursor-pointer bg-transparent border-none p-0 m-0">Logout</button>
    {:else}
      <a href="/login">Login</a>
      <a href="/register">Register</a>
    {/if}
  </nav>
</header>
