<script lang="ts">
  import { login } from '$lib/stores/authStore';

  let username: string = '';
  let password: string = '';
  let error: string = '';

  const handleLogin = async (): Promise<void> => {
    try {
      await login(username, password);
      window.location.href = '/profile'; // Redirect to profile page after login
    } catch (err) {
      error = 'Invalid credentials';
    }
  };
</script>

<h1>Login</h1>
<form on:submit|preventDefault={handleLogin}>
  <div>
    <label for="username">Username:</label>
    <input type="text" id="username" bind:value={username} required />
  </div>
  <div>
    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} required />
  </div>
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
  <button type="submit">Login</button>
</form>
<p>Don't have an account? <a href="/register">Register here</a>.</p>