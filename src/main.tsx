import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Tasks from './pages/Task/Task';
import Login from './pages/Login/Login';
import Registration from './pages/Registration/Registration';
import Header from './layout/Header';
import Categories from './pages/Category/categories';

const sections = [
  { title: 'Task', url: '#' },
  { title: 'Category', url: '#' },
  { title: 'Tag', url: '#' },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <Header title="TODO" sections={sections} />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/registration',
        element: <Registration />,
      },
      {
        path: '/tasks',
        element: <Tasks />,
      },
      {
        path: '/categories',
        element: <Categories />,
      },
    ],
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
