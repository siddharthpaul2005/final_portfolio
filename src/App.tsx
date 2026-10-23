import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SEO from './components/SEO';
import TopBar from './components/ios/TopBar';
import Dock from './components/ios/Dock';
import Wallpaper from './components/layout/Wallpaper';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import BlogContent from './components/BlogContent';
import BlogList from './pages/BlogList';
import AllProjects from './pages/AllProjects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import Uses from './pages/Uses';
import Certificates from './pages/Certificates';
import Photos from './pages/Photos';
import Resume from './pages/Resume';
import Now from './pages/Now';
import ScrollToTop from './components/common/ScrollToTop';
import PageTransition from './components/ui/PageTransition';
import CommandPalette from './components/CommandPalette';
import useUIStore from './store/useUIStore';
import useAppStore from './store/useAppStore';

const page = (element: React.ReactNode) => <PageTransition>{element}</PageTransition>;

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={page(<Home />)} />
        <Route path="/about" element={page(<About />)} />
        <Route path="/now" element={page(<Now />)} />
        <Route path="/projects" element={page(<AllProjects />)} />
        <Route path="/projects/:slug" element={page(<ProjectDetail />)} />
        <Route path="/blog" element={page(<BlogList />)} />
        <Route path="/blog/:slug" element={page(<BlogContent />)} />
        <Route path="/contact" element={page(<Contact />)} />
        <Route path="/resume" element={page(<Resume />)} />
        <Route path="/certificates" element={page(<Certificates />)} />
        <Route path="/photos" element={page(<Photos />)} />
        <Route path="/uses" element={page(<Uses />)} />
        {/* Retired pages: send old links somewhere sensible */}
        <Route path="/gears" element={<Navigate to="/uses" replace />} />
        <Route path="/extensions" element={<Navigate to="/uses" replace />} />
        <Route path="/bucket-list" element={<Navigate to="/" replace />} />
        <Route path="/experience" element={<Navigate to="/now" replace />} />
        <Route path="/all-posts" element={<Navigate to="/blog" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { setActiveLink } = useAppStore();

  return (
    <Router>
      <ScrollToTop />
      <SEO />
      <Wallpaper />
      <div className="min-h-screen text-foreground overflow-x-hidden relative">
        <TopBar />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
        <Dock />
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onNavigate={setActiveLink}
        />
      </div>
    </Router>
  );
};

export default App;
