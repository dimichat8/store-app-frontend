import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './components/AuthProvider';
import AppContent from '../src/components/AppContent';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;