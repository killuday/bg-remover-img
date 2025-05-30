import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@huggingface/transformers"]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          transformers: ["@huggingface/transformers"]
        }
      }
    },
    // Copy ONNX runtime files to output directory
    assetsInlineLimit: 0
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  }
});
