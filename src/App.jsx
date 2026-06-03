import React, { useEffect } from "react";
import "./index.css";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./app/Home";
import Admission from "./app/Admission";
import NotFound from "./app/NotFound";
import HelpDesk from "./app/HelpDesk";
import About from "./app/About";
import Programs from "./app/Programs";
import Eligibility from "./app/Eligibility";

import Apply from "./app/Apply";
import Login from "./app/admin/Login";
import Dashboard from "./app/admin/Dashboard";
import Contact from "./app/Contact";
import Help from "./app/Help";
import { Toaster } from "sonner";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// Page transition wrapper
function PageTransition({ children }) {
  return <div className="page-enter min-h-[calc(100vh-4rem)]">{children}</div>;
}

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          <p className="text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  return user ? children : <Navigate to="/admin" />;
};

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/programs"
          element={
            <PageTransition>
              <Programs />
            </PageTransition>
          }
        />
        <Route
          path="/admission"
          element={
            <PageTransition>
              <Admission />
            </PageTransition>
          }
        />
        <Route
          path="/eligibility"
          element={
            <PageTransition>
              <Eligibility />
            </PageTransition>
          }
        />
        <Route
          path="/apply"
          element={
            <PageTransition>
              <Apply />
            </PageTransition>
          }
        />
        <Route
          path="/admin"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          }
        />
        <Route
          path="/help"
          element={
            <PageTransition>
              <Help />
            </PageTransition>
          }
        />
        <Route
          path="/help-desk"
          element={
            <PageTransition>
              <HelpDesk />
            </PageTransition>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
      <Footer />
      <Toaster richColors position="top-right" closeButton />
    </>
  );
};

export default App;
