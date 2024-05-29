import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import mkcert from 'vite-plugin-mkcert';


const isSupabase = process.env.VITE_APP_SUPABASE_URL === 'true'

export default defineConfig({
  plugins: [react(), mkcert()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
 
 
})
