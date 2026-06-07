import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'prompt',
			includeAssets: ['favicon.ico', 'icon.svg', 'apple-touch-icon-180x180.png'],
			manifest: {
				name: 'Devin Wu - 個人網站',
				short_name: 'Devin Wu',
				description: 'Devin Wu 的個人網站 - 網頁開發者',
				theme_color: '#2563eb',
				background_color: '#ffffff',
				display: 'standalone',
				scope: '/',
				start_url: '/',
				lang: 'zh-TW',
				icons: [
					{
						src: 'pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png'
					},
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: 'maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}']
			}
		})
	]
});
