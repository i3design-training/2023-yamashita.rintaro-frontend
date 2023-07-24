import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './app/store';
import { TokenProvider } from './context/TokenContext';
import './index.css';
import { Header } from './layout/Header';
import Categories from './pages/Category/categories';
import Login from './pages/Login/Login';
import Registration from './pages/Registration/Registration';
import RegistrationComplete from './pages/Registration/RegistrationComplete';
import Tasks from './pages/Task/Task';
import TaskDetail from './pages/Task/TaskDetail';
import TaskStatuses from './pages/TaskStatus/taskstatus';
import UserProfile from './pages/User/profile';
import { AuthRoute } from './routes/AuthRoute';

const routes = {
  home: '/',
  login: '/login',
  profile: '/profile',
  registration: '/registration',
  registrationComplete: '/registrationComplete',
  tasks: '/tasks',
  taskDetail: '/tasks/:taskId',
  taskstatus: '/taskstatus',
  categories: '/categories',
};

const sections = [
  { title: 'Task', url: routes.tasks },
  { title: 'Category', url: routes.categories },
  { title: 'TaskStatus', url: routes.taskstatus },
];

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Header title="TODO" sections={sections} />,
    children: [
      {
        path: routes.login,
        element: <Login />,
      },
      {
        path: routes.registration,
        element: <Registration />,
      },
      {
        path: routes.registrationComplete,
        element: <RegistrationComplete />,
      },
      {
        path: routes.tasks,
        element: (
          <AuthRoute>
            <Tasks />
          </AuthRoute>
        ),
      },
      {
        path: routes.taskDetail,
        element: (
          <AuthRoute>
            <TaskDetail />
          </AuthRoute>
        ),
      },
      {
        path: routes.profile,
        element: <UserProfile />,
      },
      {
        path: routes.categories,
        element: <Categories />,
      },
      {
        path: routes.taskstatus,
        element: <TaskStatuses />,
      },
    ],
  },
]);

const container = document.getElementById('root');

if (container) {
  ReactDOM.createRoot(container).render(
    <StrictMode>
      <Provider store={store}>
        <TokenProvider>
          <RouterProvider router={router} />
        </TokenProvider>
      </Provider>
    </StrictMode>,
  );
}
