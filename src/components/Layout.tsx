import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaApple, FaGooglePlay, FaLocationArrow } from "react-icons/fa";

// JSON data for header and footer
const layoutData = {
  header: {
    logo: {
      src: "/logo.svg",
      alt: "PMX Logo",
      title: "PMXLOGISTICS",
    },
    navItems: [
      { label: "Home", sectionId: "home" },
      { label: "Tracking", sectionId: "tracking" },
      { label: "Services", sectionId: "services" },
      { label: "About Us", sectionId: "aboutus" },
      { label: "Contact Us", sectionId: "contactus" },
    ],
    // dropdownItems: [
    //   { label: "Article Details", link: "/article" },
    //   { label: "Terms & Conditions", link: "/terms" },
    //   { label: "Privacy Policy", link: "/privacy" }
    // ],
    socialLinks: [
      // { icon: "FaGooglePlay", link: "#your-link" },
      {
        icon: "FaLocationArrow",
        link: "https://maps.app.goo.gl/rhDVm5tmT26bCUHV9",
      },
    ],
  },
  footer: {
    text: "&copy; 2024 PMXpress. All Rights Reserved.",
    subText: "Designed and developed by Zet (Startup Dev)",
  },
};

const Layout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      scrollToSection(sectionId);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    if (location.pathname === "/") {
      scrollToSection(sectionId);
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white w-full overflow-x-hidden">
      <Helmet>
        <title>PMXpress Logistic Service</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Helmet>

      {/* Header */}
      <header className="bg-[#28305c] text-white py-3 shadow-lg fixed w-full z-50 max-w-full ">
        <div className="mx-auto flex justify-between items-center px-4 lg:px-8">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img
              src={layoutData.header.logo.src}
              alt={layoutData.header.logo.alt}
              className="h-10 w-48 object-contain"
            />
            {/* <h1 className="text-2xl font-semibold">
              {layoutData.header.logo.title}
            </h1> */}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <ul className="flex space-x-6 text-white font-semibold">
              {layoutData.header.navItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleScrollToSection(item.sectionId)}
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {/* 
              <li className="relative group">
                <span className="hover:text-yellow-400 transition duration-300 cursor-pointer">
                  Drop
                </span>
                  
              <div className="absolute hidden group-hover:block bg-white text-gray-700 shadow-lg rounded mt-1 min-w-60">
                  {layoutData.header.dropdownItems.map((dropdownItem, index) => (
                    <Link
                      key={index}
                      to={dropdownItem.link}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              </li> */}
            </ul>

            {/* Social Icons */}
            <div className="flex space-x-4 ml-6">
              {layoutData.header.socialLinks.map((socialLink, index) => {
                const IconComponent =
                  socialLink.icon === "FaGooglePlay"
                    ? FaGooglePlay
                    : FaLocationArrow;
                return (
                  <a
                    key={index}
                    href={socialLink.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-yellow-400 transition duration-300"
                  >
                    <IconComponent size={24} />
                  </a>
                );
              })}
            </div>
          </nav>

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
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden mt-4 bg-[#28305c] px-4">
            <ul className="space-y-4 text-white font-semibold">
              {layoutData.header.navItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      handleScrollToSection(item.sectionId);
                      toggleMenu();
                    }}
                    className="block text-lg hover:text-yellow-400 transition duration-200"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="w-full min-h-screen pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#212e5b] text-white p-6 text-center">
        <div className="container mx-auto">
          <p className="text-sm">{layoutData.footer.text}</p>
          <p className="text-xs mt-1">{layoutData.footer.subText}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
