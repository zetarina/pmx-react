import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Layout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>PMXpress Logistic Service</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Helmet>

      {/* Header */}
      <header className="bg-[#1d285d] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="PMX Logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-2xl md:text-3xl font-bold">PMXpress</h1>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="hidden md:flex items-center space-x-8">
              <li>
                <Link
                  to="/"
                  className="text-lg hover:text-[#e37525] transition duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/tracking"
                  className="text-lg hover:text-[#e37525] transition duration-200"
                >
                  Tracking
                </Link>
              </li>
              <li className="transition-transform duration-300 ">
                <Link
                  to="/login"
                  className="block text-lg font-medium text-gray-700 bg-white hover:bg-[#e37525] hover:text-white transition-colors duration-300 rounded-lg px-4 py-2"
                >
                  Login
                </Link>
              </li>
            </ul>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-white focus:outline-none"
                aria-label="Open menu"
                onClick={toggleMenu}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden mt-4">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="block text-lg hover:text-[#e37525] transition duration-200"
                  onClick={toggleMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/tracking"
                  className="block text-lg hover:text-[#e37525] transition duration-200"
                  onClick={toggleMenu}
                >
                  Tracking
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="block text-lg hover:text-[#e37525] transition duration-200 "
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="w-full bg-blue-900 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#212e5b] text-white p-6 text-center">
        <div className="container mx-auto">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PMXpress. All Rights Reserved.
          </p>
          <p className="text-xs mt-1">
            Designed and developed by Zet (Startup Dev)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
