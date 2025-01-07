<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    interface Announcement {
        id: string;
        title: string;
        message: string;
        status: string;
        timestamp: string;
    }

    let announcements: Announcement[] = [];
    let isLoading: boolean = true;
    let error: string | null = null;
    let eventSource: EventSource | null = null;
    let loadingAnnouncementId: string | null = null;

    function handleMessage(event: MessageEvent) {
        try {
            const data: Announcement[] = JSON.parse(event.data);
            announcements = data;
            isLoading = false;
        } catch (err) {
            console.error('Failed to parse SSE data:', err);
            error = 'Failed to process announcements.';
            isLoading = false;
        }
    }

    function handleError(err: Event) {
        console.error('SSE error:', err);
        error = 'Failed to connect to live updates.';
        isLoading = false;
    }

    onMount(() => {
        eventSource = new EventSource('/sse/announcements/');
        eventSource.onmessage = handleMessage;
        eventSource.onerror = handleError;
        eventSource.onopen = () => {
            console.log('SSE connection established.');
            error = null;
        };
    });

    onDestroy(() => {
        if (eventSource) {
            eventSource.close();
        }
    });

    async function handleAnnouncementAction(announcementId: string) {
        loadingAnnouncementId = announcementId;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async action
        alert(`View details for Announcement ID: ${announcementId}`);
        loadingAnnouncementId = null;
    }

    function getStatusColor(status: string): string {
        return status === 'active' ? 'text-yellow-500' :
               status === 'resolved' ? 'text-green-500' :
               'text-blue-500';
    }
</script>

<div class="w-full bg-white shadow-md rounded-lg p-6">
    <h2 class="text-xl font-bold mb-4">Announcements</h2>

    {#if isLoading}
        <div class="text-center py-4">
            <p>Loading announcements...</p>
        </div>
    {:else if error}
        <div class="text-center py-4 text-red-500">
            <p>{error}</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each announcements as announcement}
                <div class="p-4 rounded-lg bg-gray-50">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-medium">{announcement.title}</p>
                            <p class="text-sm text-gray-500">
                                Status: 
                                <span class={getStatusColor(announcement.status)}>
                                    {announcement.status}
                                </span>
                            </p>
                        </div>
                        <p class="text-sm text-gray-500">{announcement.timestamp}</p>
                    </div>
                    <div class="mt-2">
                        <p class="text-sm text-gray-700">{announcement.message}</p>
                    </div>
                    <div class="mt-3">
                        <button
                            on:click={() => handleAnnouncementAction(announcement.id)}
                            class="w-full px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            disabled={loadingAnnouncementId === announcement.id}
                            aria-label="View details for announcement"
                        >
                            {loadingAnnouncementId === announcement.id ? 'Loading...' : 'View Details'}
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>