<script>
    import { onMount, onDestroy } from 'svelte';

    let announcements = []; // Store the list of announcements
    let isLoading = true; // Track loading state
    let error = null; // Track errors
    let eventSource; // Store the EventSource instance

    // Handle incoming SSE messages
    function handleMessage(event) {
        const data = JSON.parse(event.data); // Parse the SSE data
        announcements = data; // Update the announcements array
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
        eventSource = new EventSource('/sse/announcements/');
        eventSource.onmessage = handleMessage; // Listen for messages
        eventSource.onerror = handleError; // Listen for errors
    });

    // Close the SSE connection when the component is destroyed
    onDestroy(() => {
        if (eventSource) {
            eventSource.close(); // Clean up the EventSource
        }
    });

    // Function to handle announcement actions (e.g., view details)
    function handleAnnouncementAction(announcementId) {
        alert(`View details for Announcement ID: ${announcementId}`);
    }
</script>

<div class="w-full bg-white shadow-md rounded-lg p-6">
    <h2 class="text-xl font-bold mb-4">Announcements</h2>

    {#if isLoading}
        <!-- Show a loading message -->
        <div class="text-center py-4">
            <p>Loading announcements...</p>
        </div>
    {:else if error}
        <!-- Show an error message -->
        <div class="text-center py-4 text-red-500">
            <p>{error}</p>
        </div>
    {:else}
        <!-- Display the list of announcements -->
        <div class="space-y-4">
            {#each announcements as announcement}
                <div class="p-4 rounded-lg bg-gray-50">
                    <!-- Announcement Details -->
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-medium">{announcement.title}</p>
                            <p class="text-sm text-gray-500">
                                Status: 
                                <span class={
                                    announcement.status === 'active' ? 'text-yellow-500' :
                                    announcement.status === 'resolved' ? 'text-green-500' :
                                    'text-blue-500'
                                }>
                                    {announcement.status}
                                </span>
                            </p>
                        </div>
                        <p class="text-sm text-gray-500">{announcement.timestamp}</p>
                    </div>

                    <!-- Announcement Message -->
                    <div class="mt-2">
                        <p class="text-sm text-gray-700">{announcement.message}</p>
                    </div>

                    <!-- Action Button -->
                    <div class="mt-3">
                        <button
                            on:click={() => handleAnnouncementAction(announcement.id)}
                            class="w-full px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>