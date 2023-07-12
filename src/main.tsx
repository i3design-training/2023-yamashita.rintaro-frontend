import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Tasks from './pages/Task/Task';
import Login from './pages/Login/Login';
import Registration from './pages/Registration/Registration';
import Header from './layout/Header';
import Categories from './pages/Category/categories';
import RegistrationComplete from './pages/Registration/RegistrationComplete';
import { TokenProvider } from './context/TokenContext';
import { AuthRoute } from './routes/AuthRoute';
import { StrictMode } from 'react';
import TaskDetail from './pages/Task/TaskDetail';

const sections = [
  { title: 'Task', url: '#' },
  { title: 'Category', url: '#' },
  { title: 'Tag', url: '#' },
];

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTRATION: '/registration',
  REGISTRATION_COMPLETE: '/registrationComplete',
  TASKS: '/tasks',
  TASK_DETAIL: '/tasks/:taskId', // const { taskId } = useParams(); in TaskDetail.tsx
  CATEGORIES: '/categories',
};

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Header title="TODO" sections={sections} />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTES.REGISTRATION,
        element: <Registration />,
      },
      {
        path: ROUTES.REGISTRATION_COMPLETE,
        element: <RegistrationComplete />,
      },
      {
        path: ROUTES.TASKS,
        element: (
          <AuthRoute>
            <Tasks />
          </AuthRoute>
        ),
      },
      {
        path: ROUTES.TASK_DETAIL,
        element: (
          <AuthRoute>
            <TaskDetail />
          </AuthRoute>
        ),
      },

      {
        path: ROUTES.CATEGORIES,
        element: <Categories />,
      },
    ],
  },
]);

const container = document.getElementById('root');

if (container) {
  ReactDOM.createRoot(container).render(
    <StrictMode>
      <TokenProvider>
        <RouterProvider router={router} />
      </TokenProvider>
    </StrictMode>,
  );
}
