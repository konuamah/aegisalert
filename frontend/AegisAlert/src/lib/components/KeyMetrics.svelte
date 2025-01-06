<script>
  import { onMount } from 'svelte';

  let weatherMetrics = {
    temperature: null,
    humidity: null,
    windSpeed: null,
    condition: null, // Weather condition (e.g., "Sunny", "Cloudy")
  };
  let isLoading = true;
  let error = null;

  // Fetch weather data from WeatherAPI
  async function fetchWeatherData() {
    const apiKey = 'ee61d12190f244298a3183003250601'; // Replace with your WeatherAPI key
    const city = 'Accra'; // Replace with your desired city
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Update weather metrics
      weatherMetrics = {
        temperature: data.current.temp_c, // Temperature in Celsius
        humidity: data.current.humidity, // Humidity in percentage
        windSpeed: data.current.wind_kph, // Wind speed in km/h
        condition: data.current.condition.text, // Weather condition (e.g., "Sunny")
      };
      isLoading = false;
    } catch (err) {
      error = `Failed to fetch weather data: ${err.message}`;
      isLoading = false;
    }
  }

  // Fetch data when the component mounts
  onMount(() => {
    fetchWeatherData();
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
      <!-- Temperature -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-500">Temperature</p>
        <p class="text-2xl font-bold">{weatherMetrics.temperature}°C</p>
      </div>

      <!-- Humidity -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-500">Humidity</p>
        <p class="text-2xl font-bold">{weatherMetrics.humidity}%</p>
      </div>

      <!-- Wind Speed -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-500">Wind Speed</p>
        <p class="text-2xl font-bold">{weatherMetrics.windSpeed} km/h</p>
      </div>

      <!-- Weather Condition -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-500">Condition</p>
        <p class="text-2xl font-bold">{weatherMetrics.condition}</p>
      </div>
    </div>
  {/if}
</div>