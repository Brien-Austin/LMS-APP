import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Toaster />
        <App />
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
