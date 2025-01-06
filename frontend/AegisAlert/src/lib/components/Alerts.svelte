<script>
  import { onMount } from "svelte";
  import { fetchDisaster} from "../utils/api.js";

  // Array to store all alerts
  let alerts = [];

  // Fetch all alerts when the component mounts
  onMount(async () => {
    alerts = await fetchDisaster();    
    // Extract and display only the name and affected_radius
    alerts.forEach(alert => {
        console.log(`Name: ${alert.message}, Affected Radius: ${alert.affectedRadius}`);
    });   
  });
</script>

<!-- Panel UI -->
<div class="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6 mx-auto">
  <h2 class="text-xl font-bold mb-4">Disaster Alerts Panel</h2>
  <div class="space-y-4">
    {#if alerts.length === 0}
      <p class="text-gray-500">Loading alerts...</p>
    {:else}
      {#each alerts.slice(0, 3) as alert}
          <div class="flex justify-between items-center">
            <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <span class="font-medium">{alert.message}</span>
            </div>            <span class="text-sm text-gray-500">{alert.timestamp}</span>
          </div>
        
      {/each}
    {/if}
  </div>
</div>

<style>
  /* Optional: Add custom styles */
  .bg-red-50 {
    background-color: #fef2f2;
  }
  .bg-yellow-50 {
    background-color: #fffbeb;
  }
</style>