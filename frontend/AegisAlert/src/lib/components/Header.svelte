<script>
    import { onMount } from 'svelte';
    import { user, logout } from '$lib/stores/authStore'; // Import the logout function
    import { fade, fly } from 'svelte/transition';
  
    let isMenuOpen = false;
    let isLoading = true; // Add a loading state
  
    // Check authentication status
    async function checkAuthStatus() {
      try {
        // Simulate an asynchronous check (e.g., fetching user data)
        await new Promise((resolve) => setTimeout(resolve, 500)); // Replace with actual auth check
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        isLoading = false; // Set loading to false when done
      }
    }
  
    // Handle logout
    async function handleLogout() {
      try {
        await logout(); // Call the logout function
        console.log('User logged out successfully');
        // Optionally, redirect to the home page or login page
        window.location.href = '/'; // Redirect to home page
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  
    onMount(() => {
      checkAuthStatus(); // Call the auth check on mount
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
        <!-- Show a loading spinner or placeholder -->
        <div class="block md:inline-block mx-2">Loading...</div>
      {:else if $user}
        <a href="/profile">Profile</a>
        <a on:click={handleLogout} href="#" class="cursor-pointer">Logout</a> <!-- Add logout handler -->
      {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      {/if}
    </nav>
  </header>