import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../components/ui/Button";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const baseNavigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Admission", href: "/admission" },
  { name: "Eligibility", href: "/eligibility" },
  { name: "Help", href: "/help" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const navigation = user
    ? [...baseNavigation, { name: "Dashboard", href: "/admin/dashboard" }]
    : baseNavigation;

  // Track Firebase auth user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // Hide navbar on scroll down, show on scroll up + track scrolled state
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 20);

          if (currentScrollY < lastScrollY.current) {
            setIsVisible(true); // scrolling up
          } else if (currentScrollY > 80) {
            setIsVisible(false); // scrolling down
          } else {
            setIsVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-500 ease-out
          ${
            isVisible
              ? "translate-y-0"
              : "-translate-y-full"
          }
          ${
            scrolled
              ? "glass-strong shadow-sm"
              : "bg-transparent"
          }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
              <div className="relative flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/20">
                <img
                  src="/logo.png"
                  alt="WP Admission Logo"
                  className="h-5 w-5 object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  WP<span className="text-primary">Admission</span>
                </span>
                <span className="text-[10px] text-muted-foreground tracking-wide hidden sm:block">
                  Official CET WP Admission Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile menu icon */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium leading-6 rounded-lg transition-all duration-200
                  ${
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3 -bottom-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-3">
            <Link to="/apply">
              <Button size="sm" className="shadow-sm">
                Apply Now
              </Button>
            </Link>
            {user ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 glass-strong animate-fade-in">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <Link
                to="/"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
                  <img
                    src="/logo.png"
                    alt="WP Admission Logo"
                    className="h-5 w-5 object-contain"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    WP<span className="text-primary">Admission</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground tracking-wide">
                    Official CET WP Admission Portal
                  </span>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile links */}
            <div className="flex-1 overflow-y-auto py-4 px-4">
              <div className="flex flex-col space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-3 rounded-xl text-base font-medium leading-7 transition-all ${
                      isActive(item.href)
                        ? "text-primary bg-primary/5 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile footer buttons */}
              <div className="mt-8 flex flex-col gap-3 px-2">
                <Link to="/apply" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full shadow-sm">Apply Now</Button>
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Admin Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
