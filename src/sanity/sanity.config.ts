import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schema';

export default defineConfig({
  name: 'default',
  title: 'D Store Admin',
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'el3r3rtq',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  basePath: '/admin',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
