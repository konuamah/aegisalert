<script lang="ts">
  import { onMount } from "svelte";
  import { fetchDisasters } from "../utils/api";

  interface Alert {
    message: string;
    timestamp: string;
  }

  let alerts: Alert[] = [];
  let isLoading: boolean = true;

  onMount(async () => {
    try {
      alerts = await fetchDisasters();
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6 mx-auto">
  <h2 class="text-xl font-bold mb-4">Disaster Alerts Panel</h2>
  <div class="space-y-4">
    {#if isLoading}
      <p class="text-gray-500">Loading alerts...</p>
    {:else if alerts.length === 0}
      <p class="text-gray-500">No alerts found.</p>
    {:else}
      {#each alerts.slice(0, 3) as alert}
        <div class="flex justify-between items-center">
          <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <span class="font-medium">{alert.message}</span>
          </div>
          <span class="text-sm text-gray-500">{alert.timestamp}</span>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
</style>