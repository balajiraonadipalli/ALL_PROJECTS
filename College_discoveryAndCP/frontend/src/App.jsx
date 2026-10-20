import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import Dashboard from './pages/admin/Dashboard';
import CollegeEditor from './pages/admin/CollegeEditor';
import Discovery from './pages/public/Discovery';
import CollegeDetail from './pages/public/CollegeDetail';
import Compare from './pages/public/Compare';

import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Toaster position="bottom-left" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Discovery />} />
          <Route path="college/:slug" element={<CollegeDetail />} />
          <Route path="compare" element={<Compare />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="colleges" element={<CollegeEditor />} />
          <Route path="colleges/edit/:slug" element={<CollegeEditor />} />
          <Route path="settings" element={<div className="p-4">Settings coming soon...</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;


