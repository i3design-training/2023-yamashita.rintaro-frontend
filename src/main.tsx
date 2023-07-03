import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Tasks from './pages/Task/Task';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/tasks',
    element: <Tasks />,
  },
]);

const container = document.getElementById('root');

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
