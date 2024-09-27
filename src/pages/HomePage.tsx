import React, { useEffect, useState } from "react";
import HeroSection from "../home/HeroSection"; // Import HeroSection
import ParcelTrackingSection from "../home/ParcelTrackingSection"; // Import ParcelTrackingSection
import FeaturesSection from "../home/FeaturesSection"; // Import FeaturesSection
import ContactUsSection from "../home/ContactUs";
import { useLocation } from "react-router-dom";
import AboutUs from "../home/AboutUs";
import { FaArrowUp } from "react-icons/fa"; // Import an up arrow icon

const HomePage = () => {
  const location = useLocation();
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const scrollToSection = () => {
      const hash = location.hash.replace("#", ""); // Remove the '#' symbol
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    scrollToSection(); // Scroll to the section when the component mounts
  }, [location]);

  // Show or hide the scroll-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Include Hero Section */}
      <HeroSection />

      {/* Include Parcel Tracking Section */}
      <ParcelTrackingSection />
      <AboutUs />
      {/* Include Features Section */}
      <FeaturesSection />

      <ContactUsSection />

      {/* Scroll-to-Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#f27821] text-white p-3 rounded-full shadow-lg hover:bg-[#1f2a4c] transition duration-300 flex items-center justify-center"
          aria-label="Scroll to Top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}
    </>
  );
};

export default HomePage;
