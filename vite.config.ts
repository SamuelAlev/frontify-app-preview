import presetIcons from "@unocss/preset-icons";
import presetWind4 from "@unocss/preset-wind4";
import react from "@vitejs/plugin-react";
import unocss from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	optimizeDeps: {
		exclude: ["brotli-wasm"],
	},
	build: {
		minify: true,
		sourcemap: true,
		assetsInlineLimit: 0,
	},
	plugins: [
		react(),
		unocss({
			presets: [presetWind4(), presetIcons()],
		}),
	],
});
