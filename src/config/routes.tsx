import React from 'react';
import Dashboard from '../pages/transverse/Dashboard';
import CompaniesListPage from '../pages/Companies/CompaniesListPage';
import CompanyView from '../pages/Companies/CompanyView';
import CompanyCreate from '../pages/Companies/CompanyCreate';
import CompanyEdit from '../pages/Companies/CompanyEdit';
import ApplicationsListPage from '../pages/Applications/ApplicationsListPage';
import ApplicationView from '../pages/Applications/ApplicationView';
import ApplicationCreate from '../pages/Applications/ApplicationCreate';
import ApplicationEdit from '../pages/Applications/ApplicationEdit';

export interface RouteConfig {
  path: string;
  element: React.ReactElement;
}

export const appRoutes: RouteConfig[] = [
  { path: 'dashboard', element: <Dashboard /> },
  { path: 'companies', element: <CompaniesListPage /> },
  { path: 'companies/new', element: <CompanyCreate /> },
  { path: 'companies/:id/view', element: <CompanyView /> },
  { path: 'companies/:id/edit', element: <CompanyEdit /> },
  { path: 'applications', element: <ApplicationsListPage /> },
  { path: 'applications/new', element: <ApplicationCreate /> },
  { path: 'applications/:id/view', element: <ApplicationView /> },
  { path: 'applications/:id/edit', element: <ApplicationEdit /> }
];

// Routes for matchRoutes (needs absolute paths)
export const routesForMatching = appRoutes.map(route => ({
  path: '/' + route.path,
  element: route.element,
}));


