import { Routes, Route } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import AllBlogsPage from './pages/AllBlogsPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AllBlogsPage />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/editor/:id" element={<EditorPage />} />
      <Route path='/auth' element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;