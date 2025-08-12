import { lazy, type JSX } from 'react';
import { type RouteObject } from 'react-router-dom';
import Navigator from './Providers/Navigator';

import DashboardLayout from './Layout/Layout';
import AnimateWrapper from './components/AnimateWrapper';

const withSuspense = (
  Component: React.LazyExoticComponent<() => JSX.Element>
) => {
  return (
    <AnimateWrapper>
      <Component />
    </AnimateWrapper>
  );
};
const HomePage = lazy(() => import('./pages/Home/Home'));
const Workers = lazy(() => import('./pages/Workers/Workers'));
const WorkersDetail = lazy(() => import('./pages/Workers/Workers'));
const LoginPage = lazy(() => import('./pages/Login/Login'));
const Schedule = lazy(() => import('./pages/Schedule/Schedule'));
const MonthlySchedule = lazy(
  () => import('./pages/Schedule/DayMonthController')
);
const Control = lazy(() => import('./pages/Controll/Control'));
const ControlDetail = lazy(() => import('./pages/Controll/ControlDetail'));
const NotFoundPage = lazy(() => import('./pages/NotFounds/NotFoundPage'));
const NotFoundModule = lazy(() => import('./pages/NotFounds/NotFoundModule'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigator />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: 'home',
            element: withSuspense(HomePage)
          },
          {
            path: 'workers',
            element: withSuspense(Workers)
          },
          {
            path: 'workers/:id',
            element: withSuspense(WorkersDetail)
          },
          {
            path: 'schedule/yearly',
            element: withSuspense(Schedule)
          },
          {
            path: 'schedule/:yyyymmdd',
            element: withSuspense(MonthlySchedule)
          },
          {
            path: 'control',
            element: withSuspense(Control)
          },
          {
            path: 'control/:id',
            element: withSuspense(ControlDetail)
          },
          {
            path: '*',
            element: withSuspense(NotFoundModule)
          }
        ]
      }
    ]
  },
  {
    path: 'login',
    element: withSuspense(LoginPage)
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];
