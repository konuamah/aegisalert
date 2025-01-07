<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchWeatherData } from '../utils/api';

  interface WeatherMetrics {
    temperature: number | null;
    humidity: number | null;
    windSpeed: number | null;
    condition: string | null;
  }

  let weatherMetrics: WeatherMetrics = {
    temperature: null,
    humidity: null,
    windSpeed: null,
    condition: null,
  };

  let isLoading: boolean = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const data = await fetchWeatherData('Accra');
      weatherMetrics = data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6">
  <h2 class="text-xl font-bold mb-4">Real-Time Weather Metrics</h2>

  {#if isLoading}
    <div class="text-center py-4">
      <p>Loading weather data...</p>
    </div>
  {:else if error}
    <div class="text-center py-4 text-red-500">
      <p>{error}</p>
    </div>
  {:else}
    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-500">Temperature</p>
        <p class="text-2xl font-bold">{weatherMetrics.temperature}°C</p>
      </div>
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-500">Humidity</p>
        <p class="text-2xl font-bold">{weatherMetrics.humidity}%</p>
      </div>
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-500">Wind Speed</p>
        <p class="text-2xl font-bold">{weatherMetrics.windSpeed} km/h</p>
      </div>
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-500">Condition</p>
        <p class="text-2xl font-bold">{weatherMetrics.condition}</p>
      </div>
    </div>
  {/if}
</div>
