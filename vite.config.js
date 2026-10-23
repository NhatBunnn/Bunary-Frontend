import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const aliases = {
  "@": path.resolve(__dirname, "src"),
  "@api": path.resolve(__dirname, "src/api"),
  "@assets": path.resolve(__dirname, "src/assets"),
  "@builders": path.resolve(__dirname, "src/builders"),
  "@components": path.resolve(__dirname, "src/components"),
  "@config": path.resolve(__dirname, "src/config"),
  "@context": path.resolve(__dirname, "src/context"),
  "@features": path.resolve(__dirname, "src/features"),
  "@hooks": path.resolve(__dirname, "src/hooks"),
  "@i18n": path.resolve(__dirname, "src/i18n"),
  "@layouts": path.resolve(__dirname, "src/layouts"),
  "@pages": path.resolve(__dirname, "src/pages"),
  "@routes": path.resolve(__dirname, "src/routes"),
  "@service": path.resolve(__dirname, "src/service"),
  "@styles": path.resolve(__dirname, "src/styles"),
  "@utils": path.resolve(__dirname, "src/utils"),
  // Support baseUrl: "src" compatibility
  api: path.resolve(__dirname, "src/api"),
  assets: path.resolve(__dirname, "src/assets"),
  builders: path.resolve(__dirname, "src/builders"),
  components: path.resolve(__dirname, "src/components"),
  config: path.resolve(__dirname, "src/config"),
  context: path.resolve(__dirname, "src/context"),
  features: path.resolve(__dirname, "src/features"),
  hooks: path.resolve(__dirname, "src/hooks"),
  i18n: path.resolve(__dirname, "src/i18n"),
  layouts: path.resolve(__dirname, "src/layouts"),
  pages: path.resolve(__dirname, "src/pages"),
  routes: path.resolve(__dirname, "src/routes"),
  service: path.resolve(__dirname, "src/service"),
  styles: path.resolve(__dirname, "src/styles"),
  utils: path.resolve(__dirname, "src/utils"),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: aliases,
  },
  server: {
    port: 3000,
    host: true,
  },
  define: {
    global: "window",
  },
});
