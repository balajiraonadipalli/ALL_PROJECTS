import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import CreateListing from './pages/CreateListing.jsx';
import EditListing from './pages/EditListing.jsx';
import ListingDetails from './pages/ListingDetails.jsx';
import HostDashboard from './pages/HostDashboard.jsx';
import Trips from './pages/Trips.jsx';
import Profile from './pages/Profile.jsx';
import TestUpload from './pages/TestUpload.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Experiences from './pages/Experiences.jsx';
import ExperienceDetails from './pages/ExperienceDetails.jsx';
import Services from './pages/Services.jsx';
import ServiceDetails from './pages/ServiceDetails.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/host/new" element={<CreateListing />} />
        <Route path="/host" element={<HostDashboard />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/listing/:id/edit" element={<EditListing />} />
        <Route path="/test-upload" element={<TestUpload />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/experience/:id" element={<ExperienceDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
      </Routes>
    </Layout>
  );
}


