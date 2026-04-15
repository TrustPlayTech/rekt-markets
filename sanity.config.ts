import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas/index'

export default defineConfig({
  name: 'blizz-markets',
  title: 'Blizz Markets',
  projectId: '4nq9cubj',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
