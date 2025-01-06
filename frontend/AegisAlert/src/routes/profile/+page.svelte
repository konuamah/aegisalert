

<script>
    import { redirect } from '@sveltejs/kit';

import { get } from 'svelte/store';


export async function load() {
    if (!get(user)) {
      throw redirect(302, '/login'); // Redirect to login if not authenticated
    }
  }
    import { user, logout, fetchUserProfile } from '$lib/stores/authStore';
    import { onMount } from 'svelte';
  
    onMount(async () => {
      await fetchUserProfile(); // Fetch user profile when the page loads
    });
  
    const handleLogout = async () => {
      await logout();
      window.location.href = '/login'; // Redirect to login page after logout
    };
  </script>
  
  <h1>Profile</h1>
  {#if $user}
    <div>
      <p>Username: {$user.username}</p>
      <p>Email: {$user.email}</p>
      <p>Phone: {$user.phone_number}</p>
      <p>Address: {$user.address}</p>
    </div>
    <button on:click={handleLogout}>Logout</button>
  {:else}
    <p>Please <a href="/login">login</a> to view your profile.</p>
  {/if}