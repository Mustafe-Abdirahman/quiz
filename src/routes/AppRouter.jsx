import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from '../components/common/ProtectedRoute';

import Landing from '../pages/Landing';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import QuizManagement from '../pages/admin/QuizManagement';
import QuestionManagement from '../pages/admin/QuestionManagement';
import CompetitionMonitor from '../pages/admin/CompetitionMonitor';
import AdminRoomManagement from '../pages/admin/AdminRoomManagement';
import AssignQuizPage from '../pages/admin/AssignQuizPage';
import AdminLayout from '../layouts/AdminLayout';

import UserDashboard from '../pages/user/UserDashboard';
import UserLayout from '../layouts/UserLayout';
import QuizList from '../pages/user/QuizList';
import QuizPlayer from '../pages/user/QuizPlayer';
import Leaderboard from '../pages/user/Leaderboard';
import CompetitionRooms from '../pages/user/CompetitionRooms';

import ProfilePage from '../pages/settings/ProfilePage';

import MultiplayerRoom from '../pages/multiplayer/MultiplayerRoom';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicOnlyRoute><Landing /></PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/quizzes" element={<ProtectedRoute role="admin"><QuizManagement /></ProtectedRoute>} />
        <Route path="/admin/questions" element={<ProtectedRoute role="admin"><QuestionManagement /></ProtectedRoute>} />
        <Route path="/admin/competition" element={<ProtectedRoute role="admin"><CompetitionMonitor /></ProtectedRoute>} />
        <Route path="/admin/rooms" element={<ProtectedRoute role="admin"><AdminRoomManagement /></ProtectedRoute>} />
        <Route path="/admin/assign" element={<ProtectedRoute role="admin"><AssignQuizPage /></ProtectedRoute>} />
        <Route path="/admin/room/:id" element={<ProtectedRoute role="admin"><AdminLayout><MultiplayerRoom /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminLayout><ProfilePage /></AdminLayout></ProtectedRoute>} />

        <Route path="/user/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/quizzes" element={<ProtectedRoute role="user"><QuizList /></ProtectedRoute>} />
        <Route path="/user/play/:id" element={<ProtectedRoute role="user"><QuizPlayer /></ProtectedRoute>} />
        <Route path="/user/leaderboard" element={<ProtectedRoute role="user"><Leaderboard /></ProtectedRoute>} />
        <Route path="/user/rooms" element={<ProtectedRoute role="user"><UserLayout><CompetitionRooms /></UserLayout></ProtectedRoute>} />
        <Route path="/user/room/:id" element={<ProtectedRoute role="user"><UserLayout><MultiplayerRoom /></UserLayout></ProtectedRoute>} />
        <Route path="/user/settings" element={<ProtectedRoute role="user"><UserLayout><ProfilePage /></UserLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
