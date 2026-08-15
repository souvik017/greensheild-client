import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Home } from './pages/public/Home';
import { Services } from './pages/public/Services';
import { ServiceDetail } from './pages/public/ServiceDetail';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { NotFound } from './pages/public/NotFound';
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { Enquiries } from './pages/admin/Enquiries';
import { Appointments } from './pages/admin/Appointments';
import { ServicesControl } from './pages/admin/ServicesControl';
import { AddServicePage } from './pages/admin/AddServicePage';
import { ServiceDetailsPage } from './pages/admin/ServiceDetailsPage';
import { Settings } from './pages/admin/Settings';
import { AdminRoute } from './components/AdminRoute/AdminRoute';
import { EnquiryDetails } from './pages/admin/EnquiryDetails';
import { AppointmentDetails } from './pages/admin/AppointmentDetails';
import { Invoices } from './pages/admin/Invoices';

const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -14 }}
    transition={{ duration: 0.22, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="services" element={<AnimatedPage><Services /></AnimatedPage>} />
          <Route path="services/:slug" element={<AnimatedPage><ServiceDetail /></AnimatedPage>} />
          <Route path="about" element={<AnimatedPage><About /></AnimatedPage>} />
          <Route path="contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
          <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
        </Route>

        <Route path="/admin" element={<AnimatedPage><AdminLogin /></AnimatedPage>} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
            <Route path="enquiries" element={<AnimatedPage><Enquiries /></AnimatedPage>} />
            <Route path="enquiries/:id" element={<AnimatedPage><EnquiryDetails /></AnimatedPage>} />
            <Route path="appointments" element={<AnimatedPage><Appointments /></AnimatedPage>} />
            <Route path="appointments/:id" element={<AnimatedPage><AppointmentDetails /></AnimatedPage>} />
            <Route path="invoices" element={<AnimatedPage><Invoices /></AnimatedPage>} />
            <Route path="services" element={<AnimatedPage><ServicesControl /></AnimatedPage>} />
            <Route path="services/new" element={<AnimatedPage><AddServicePage /></AnimatedPage>} />
            <Route path="services/:id" element={<AnimatedPage><ServiceDetailsPage /></AnimatedPage>} />
            <Route path="settings" element={<AnimatedPage><Settings /></AnimatedPage>} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;
