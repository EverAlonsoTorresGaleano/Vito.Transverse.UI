import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from './theme/theme';
import LoginPage from './pages/transverse/LoginPage';
import Layout from './pages/transverse/Layout';
import Dashboard from './pages/transverse/Dashboard';
import CompaniesListPage from './pages/Companies/CompaniesListPage';
import Loading from './components/Loading';
import { isAuthenticated } from './utils/auth';
import initI18n from './i18n/config';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initI18n();
      setI18nReady(true);
    };
    initialize();
  }, []);

  if (!i18nReady) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="companies" element={<CompaniesListPage />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
};

export default App;

