import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://mern-stack-project-ns44.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
