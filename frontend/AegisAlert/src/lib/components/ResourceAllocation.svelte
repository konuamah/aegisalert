<script>
  import { onMount, onDestroy } from 'svelte';

  let resources = []; // Store the list of resources
  let isLoading = true; // Track loading state
  let error = null; // Track errors
  let eventSource; // Store the EventSource instance

  // Handle incoming SSE messages
  function handleMessage(event) {
      const data = JSON.parse(event.data); // Parse the SSE data
      resources = data; // Update the resources array
      isLoading = false; // Set loading to false
  }

  // Handle SSE errors
  function handleError(err) {
      console.error('SSE error:', err);
      error = 'Failed to connect to live updates.';
      isLoading = false;
  }

  // Connect to the SSE endpoint when the component mounts
  onMount(() => {
    eventSource = new EventSource('/sse/resources/');  // Use the proxy URL
    eventSource.onmessage = handleMessage;
    eventSource.onerror = handleError;
});

  // Close the SSE connection when the component is destroyed
  onDestroy(() => {
      if (eventSource) {
          eventSource.close(); // Clean up the EventSource
      }
  });
</script>

<div class="w-full bg-white shadow-md rounded-lg p-6">
  <h2 class="text-xl font-bold mb-4">Resource Allocation</h2>

  {#if isLoading}
      <!-- Show a loading message -->
      <div class="text-center py-4">
          <p>Loading resources...</p>
      </div>
  {:else if error}
      <!-- Show an error message -->
      <div class="text-center py-4 text-red-500">
          <p>{error}</p>
      </div>
  {:else}
      <!-- Display the list of resources -->
      <div class="space-y-4">
          {#each resources as resource}
              <div class="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                  <div>
                      <p class="font-medium">{resource.name}</p>
                      <p class="text-sm text-gray-500">
                          Status: 
                          <span class="{resource.status === 'available' ? 'text-green-500' : 'text-red-500'}">
                              {resource.status}
                          </span>
                      </p>
                  </div>
              </div>
          {/each}
      </div>
  {/if}
</div>