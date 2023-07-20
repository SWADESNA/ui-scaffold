import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

let vocdoniEnvironment = process.env.VOCDONI_ENVIRONMENT
if (!vocdoniEnvironment) {
  vocdoniEnvironment = 'stg'
}

const outDir = process.env.BUILD_PATH
const base = process.env.BASE_URL || ''

// https://vitejs.dev/config/
export default defineConfig({
  base,
  build: {
    outDir,
  },
  define: {
    'import.meta.env.VOCDONI_ENVIRONMENT': JSON.stringify(vocdoniEnvironment),
  },
  plugins: [tsconfigPaths(), react()],
})