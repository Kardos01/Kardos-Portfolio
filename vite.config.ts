import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/Kardos-Portfolio/", // Keeps your GitHub Pages path valid
  resolve: {
    alias: {
      // 📄 Change "./src" to "./client" to match your project folder structure
      "@": path.resolve(__dirname, "./client"), 
    },
  },
});
