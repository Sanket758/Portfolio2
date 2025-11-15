import React from 'react';
import { useAuth } from './auth/AuthContext';

// Import Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Import Portfolio Components
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

const Portfolio: React.FC = () => (
  <div className="min-h-screen">
    <Header />
    <main className="container mx-auto px-4 md:px-8 lg:px-16 pt-24">
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const path = window.location.pathname;

  if (path.startsWith('/admin')) {
    return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
  }
  
  return <Portfolio />;
};

export default App;