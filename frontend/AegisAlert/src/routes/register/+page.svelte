<script lang="ts">
	import { register } from '$lib/stores/authStore';

	interface UserData {
		username: string;
		password: string;
		email: string;
		first_name: string; 
		last_name: string;  
		address: string;
		phone_number: string; 
	}

	let username: string = '';
	let password: string = '';
	let email: string = '';
	let firstName: string = '';
	let lastName: string = '';
	let address: string = '';
	let phoneNumber: string = '';
	let error: string = '';

	const handleRegister = async () => {
		try {
			const userData: UserData = {
				username,
				password,
				email,
				first_name: firstName, 
				last_name: lastName,   
				address,
				phone_number: phoneNumber, 
			};
			await register(userData);
			window.location.href = '/profile';
		} catch (err) {
			error = 'Registration failed';
		}
	};
</script>

<h1>Register</h1>
<form on:submit|preventDefault={handleRegister}>
	<div>
		<label for="username">Username:</label>
		<input type="text" id="username" bind:value={username} required />
	</div>
	<div>
		<label for="email">Email:</label>
		<input type="email" id="email" bind:value={email} required />
	</div>
	<div>
		<label for="password">Password:</label>
		<input type="password" id="password" bind:value={password} required />
	</div>
	<div>
		<label for="firstName">First Name:</label>
		<input type="text" id="firstName" bind:value={firstName} required />
	</div>
	<div>
		<label for="lastName">Last Name:</label>
		<input type="text" id="lastName" bind:value={lastName} required />
	</div>
	<div>
		<label for="address">Address:</label>
		<input type="text" id="address" bind:value={address} required />
	</div>
	<div>
		<label for="phoneNumber">Phone Number:</label>
		<input type="tel" id="phoneNumber" bind:value={phoneNumber} required />
	</div>
	{#if error}
		<p style="color: red;">{error}</p>
	{/if}
	<button type="submit">Register</button>
</form>
<p>Already have an account? <a href="/login">Login here</a>.</p>
