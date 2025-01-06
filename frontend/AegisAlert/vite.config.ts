import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
		  '/sse': 'http://localhost:8000',  // Proxy requests to Django backend
		},
	  },
	  optimizeDeps: {
		exclude: ['chunk-Q6NMXD5Z', 'chunk-OSASYZZF'], // Add the problematic chunks here
	  },
});
