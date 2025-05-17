// @ts-check
import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import clerk from "@clerk/astro";
import tailwindcss from '@tailwindcss/vite';
import { dark } from '@clerk/themes';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [clerk({
    appearance: {
      baseTheme: dark,
      layout: {
        shimmer: false
      }
    }
  }), react()],
  vite: {
    plugins: [tailwindcss()]
  },
  adapter: node({ mode: "standalone" }),
  output: "server",
});