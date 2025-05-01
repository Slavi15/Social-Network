import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
	base: '/',
	appType: 'spa',
	plugins: [react()],
	build: {
		outDir: 'dist',
		emptyOutDir: true,
	},
	server: {
		open: true,
		hmr: true,
	},
})
