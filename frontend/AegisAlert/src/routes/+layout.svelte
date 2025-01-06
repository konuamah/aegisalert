<script lang="ts">
	import '../app.css'; // Import global styles
	import Header from '$lib/components/Header.svelte';
  
	// Define the props (children is a reserved prop for slots in Svelte)
	export let children: unknown;
  </script>
  
  <!-- Main layout structure -->
<Header>
</Header>
  
	<!-- Page content (rendered via slot) -->
	<main class="flex-grow p-4">
	  <slot>{children}</slot>
	</main>
  
	<!-- Optional Footer -->
	<footer class="bg-gray-800 text-white p-4 text-center">
	  <p>&copy; 2025 AegisAlert. All rights reserved.</p>
	</footer>
