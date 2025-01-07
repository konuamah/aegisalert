<script lang="ts">
  import { redirect } from '@sveltejs/kit';
  import { get } from 'svelte/store';
  import { user, logout, fetchUserProfile } from '$lib/stores/authStore';
  import { onMount } from 'svelte';

  interface User {
    username: string;
    email: string;
    phone_number: string;
    address: string; 
  }

  export async function load() {
    if (!get(user)) {
      throw redirect(302, '/login');
    }
  }

  onMount(async () => {
    await fetchUserProfile();
  });

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };
</script>

<h1>Profile</h1>
{#if $user}
  <div>
    <p>Username: {$user.username}</p>
    <p>Email: {$user.email}</p>
    <p>Phone: {$user.phone_number}</p>
    <p>Address: {$user.address}</p>
  <button on:click={handleLogout}>Logout</button>
  </div>
{:else}
  <p>Please <a href="/login">login</a> to view your profile.</p>
{/if}
