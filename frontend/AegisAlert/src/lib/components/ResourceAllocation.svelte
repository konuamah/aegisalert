<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  interface Resource {
    name: string;
    status: 'available' | 'unavailable';
  }
  
  let resources: Resource[] = [];
  let isLoading: boolean = true;
  let error: string | null = null;
  let eventSource: EventSource | null = null;
  
  function handleMessage(event: MessageEvent): void {
    try {
    const data: Resource[] = JSON.parse(event.data);
    resources = data;
    isLoading = false;
    } catch (err) {
    console.error('Failed to parse SSE data:', err);
    error = 'Failed to process live updates.';
    isLoading = false;
    }
  }
  
  function handleError(err: Event): void {
    console.error('SSE error:', err);
    error = 'Failed to connect to live updates.';
    isLoading = false;
  }
  
  onMount(() => {
    eventSource = new EventSource('/sse/resources/');
    eventSource.onmessage = handleMessage;
    eventSource.onerror = handleError;
  });
  
  onDestroy(() => {
    if (eventSource) {
    eventSource.close();
    }
  });
  </script>
  
  <div class="w-full bg-white shadow-md rounded-lg p-6">
  <h2 class="text-xl font-bold mb-4">Resource Allocation</h2>
  
  {#if isLoading}
    <div class="text-center py-4">
    <p>Loading resources...</p>
    </div>
  {:else if error}
    <div class="text-center py-4 text-red-500">
    <p>{error}</p>
    </div>
  {:else}
    <div class="space-y-4">
    {#each resources as resource}
      <div class="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
      <div>
        <p class="font-medium">{resource.name}</p>
        <p class="text-sm text-gray-500">
        Status:
        <span class={resource.status === 'available' ? 'text-green-500' : 'text-red-500'}>
          {resource.status}
        </span>
        </p>
      </div>
      </div>
    {/each}
    </div>
  {/if}
  </div>
