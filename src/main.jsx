import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from "@/components/ui/sonner"
import './index.css'
import App from './App.jsx'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster position='top-center' duration={2000}/>
        <App />
        </ThemeProvider>
      </QueryClientProvider>
  </BrowserRouter>
  </StrictMode>
)
