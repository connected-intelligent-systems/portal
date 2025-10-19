import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            include: ['util', 'buffer', 'stream', 'events', 'string_decoder', 'process'],
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
        }),
    ],
    define: {
        'process.env': process.env,
    },
    server: {
        host: true,
        port: 5173,
        watch: {
            usePolling: true
        },
        proxy: {
            // EDC Management API - direct proxy to EDC management endpoint
            '/api/management': {
                target: process.env.VITE_EDC_MANAGEMENT_API_URL || 'http://edc-provider:19193',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api\/management/, '/management'),
                configure: (proxy, options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        // Add EDC API key header to all management API requests
                        proxyReq.setHeader('x-api-key', process.env.VITE_EDC_API_KEY || 'supersecret');
                    });
                }
            },
            // EDC Protocol API (if needed for direct DSP communication)
            '/api/protocol': {
                target: process.env.VITE_EDC_PROTOCOL_API_URL || 'http://edc-provider:19291',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api\/protocol/, '/protocol'),
                configure: (proxy, options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        // Add EDC API key header to all protocol API requests
                        proxyReq.setHeader('x-api-key', process.env.VITE_EDC_API_KEY || 'supersecret');
                    });
                }
            },
            // Federated Catalog API
            '/api/catalog': {
                target: 'http://edc-provider:19199',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api\/catalog/, '/catalog')
            }
        }
    },
    base: './',
});
