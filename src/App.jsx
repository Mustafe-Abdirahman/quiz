import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { QuizProvider } from './context/QuizContext';
import { ToastProvider } from './components/ui/Toast';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QuizProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </QuizProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
