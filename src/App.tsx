import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import { routes } from './Router';
import { useApp } from './Providers/Configuration';
import { App, ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

const AppComponent = () => {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const splashAlreadyShown = sessionStorage.getItem('splashShown') === 'true';
    if (!splashAlreadyShown) {
      setShowSplash(true);
    }
  }, []);
  const { theme: darkOrLight } = useApp();
  return (
    <>
      {' '}
      <QueryClientProvider client={queryClient}>
        <AnimatePresence mode="sync">
          {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
          <ConfigProvider
            theme={{
              algorithm:
                darkOrLight === 'dark'
                  ? theme.darkAlgorithm
                  : theme.defaultAlgorithm
            }}
          >
            <App>
              {!showSplash && (
                <RouterProvider router={createBrowserRouter(routes)} />
              )}
            </App>
          </ConfigProvider>
        </AnimatePresence>
      </QueryClientProvider>
    </>
  );
};

export default AppComponent;
