import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Imports the React plugin

// The function must export or return a configuration object.
export default defineConfig({
  plugins: [react()],
});