import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSolid } from '@rsbuild/plugin-solid';

export default defineConfig({
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginSolid(),
  ],
  source:{
    alias: {
      '@assets': './src/assets',
      '@components': './src/components',
      '@utils': './src/utils'
    },
  },
  html: {
    favicon: './src/assets/Diameter.svg',
  }
});
