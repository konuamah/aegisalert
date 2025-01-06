<script>
	import Map from '$lib/components/Map.svelte';
	import KeyMetrics from '$lib/components/KeyMetrics.svelte';
	import Alerts from '$lib/components/Alerts.svelte';
	import EvacuationRoutes from '$lib/components/Announcements.svelte';
	import ResourceAllocation from '$lib/components/ResourceAllocation.svelte';
</script>

<main>
	
	<Map />

	<div class="flex flex-col gap-6 p-6 md:flex-row">
		<Alerts />
		<KeyMetrics />
	</div>
	<div class="p-6">
		<ResourceAllocation />

		<div class="p-6">
			<EvacuationRoutes />
		</div>
	</div>
</main>
