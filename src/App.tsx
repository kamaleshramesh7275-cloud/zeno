import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminLogin } from './pages/AdminLogin';
import { Dashboard } from './pages/Dashboard';
import { GlobalChat } from './pages/GlobalChat';
import { Partners } from './pages/Partners';
import { Session } from './pages/Session';
import { Profile } from './pages/Profile';
import { Library } from './pages/Library';
import { AdminDashboard } from './pages/AdminDashboard';
import { PomodoroPage } from './pages/PomodoroPage';
import { Store } from './pages/Store';
import { Reminders } from './pages/Reminders';
import { TeamFormation } from './pages/TeamFormation';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Student Routes with Sidebar */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pomodoro" element={<PomodoroPage />} />
          <Route path="chat" element={<GlobalChat />} />
          <Route path="partners" element={<Partners />} />
          <Route path="session/:id" element={<Session />} />
          <Route path="profile" element={<Profile />} />
          <Route path="library" element={<Library />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="store" element={<Store />} />
          <Route path="team" element={<TeamFormation />} />
        </Route>

        {/* Admin Routes without Sidebar */}
        <Route
          path="/app/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
