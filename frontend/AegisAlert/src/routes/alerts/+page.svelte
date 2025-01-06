<script>
    import { onMount } from 'svelte';
    let disasters = [];
    let isLoading = true; // Track loading state
  
    onMount(async () => {
      try {
        const response = await fetch('http://localhost:8000/disasters/disaster-list/');
        if (response.ok) {
          disasters = await response.json();
        } else {
          console.error('Failed to fetch disasters:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching disasters:', error);
      } finally {
        isLoading = false; // Set loading to false after fetch completes
      }
    });
  </script>
  
  <main class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Disaster Alerts</h1>
  
      {#if isLoading}
        <!-- Loading state -->
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      {:else if disasters.length > 0}
        <!-- Disaster list -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each disasters as disaster}
            <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                <a href="/alerts/disaster/{disaster.id}" class="hover:text-blue-600 transition-colors duration-300">
                  {disaster.name}
                </a>
              </h2>
              <p class="text-gray-600 mb-2"><span class="font-medium">Location:</span> {disaster.location}</p>
              <p class="text-gray-600 mb-2">
                <span class="font-medium">Affected Radius:</span> {disaster.affected_radius} km
              </p>
              <p class="text-gray-600">
                <span class="font-medium">Status:</span>
                <span class={`ml-1 px-2 py-1 rounded-full text-sm font-medium ${disaster.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {disaster.active ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          {/each}
        </div>
      {:else}
        <!-- No disasters found -->
        <div class="text-center py-10">
          <p class="text-gray-600 text-lg">No disasters found.</p>
          <p class="text-gray-500 mt-2">Check back later for updates.</p>
        </div>
      {/if}
    </div>
  </main>