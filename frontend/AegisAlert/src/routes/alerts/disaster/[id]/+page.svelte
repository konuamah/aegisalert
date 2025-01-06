<script>
    import Map from '$lib/components/Map.svelte';  
    /** @type {import('./$types').PageData} */
    export let data;
    $: ({ disaster } = data);
  </script>
  
  <main class="p-6 bg-gray-100 min-h-screen">
    {#if disaster}
      <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{disaster.name}</h1>
        <div class="space-y-4 text-gray-700">
          <p><span class="font-semibold">Location:</span> {disaster.location}</p>
          <p><span class="font-semibold">Affected Radius:</span> {disaster.affected_radius} km</p>
          <p>
            <span class="font-semibold">Status:</span> 
            <span class={`px-2 py-1 rounded-full text-sm ${disaster.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {disaster.active ? 'Active' : 'Inactive'}
            </span>
          </p>
        </div>
  
        <!-- Use the Map component -->
        <div class="mt-8">
          <Map {disaster} />
        </div>
  
        <a href="/alerts" class="mt-6 inline-block text-blue-600 hover:text-blue-800 underline">Back to Disaster List</a>
      </div>
    {:else}
      <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <p class="text-gray-700">Disaster not found.</p>
      </div>
    {/if}
  </main>