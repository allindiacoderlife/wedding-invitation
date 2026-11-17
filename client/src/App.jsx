import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { LoaderAnimation } from './components/common/LoaderAnimation';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoaderAnimation>
          <AppRoutes />
        </LoaderAnimation>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
