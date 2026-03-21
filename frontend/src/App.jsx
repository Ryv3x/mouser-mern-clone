import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import AppRoutes from './routes/AppRoutes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/common/LoadingScreen';
import LiveChat from './components/common/LiveChat';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './index.css';

function App() {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-grow relative pt-16">
          <AnimatePresence mode="wait">
            <AppRoutes key={location.pathname} />
          </AnimatePresence>
        </main>
        <Footer />
        <LiveChat />
        {loading && <LoadingScreen />}
      </div>
    </Provider>
  );
}

export default App;
