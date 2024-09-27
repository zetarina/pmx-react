import React, { useRef } from "react";
import { FaChevronDown } from "react-icons/fa"; // Import FontAwesome icon

const HeroSection = () => {
  const textRef = useRef<HTMLDivElement>(null);

  // Function to handle mouse movement
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (textRef.current) {
      const { clientX, clientY, currentTarget } = event;
      const { left, top, width, height } =
        currentTarget.getBoundingClientRect();

      // Calculate the mouse position relative to the center
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      // Apply a more subtle 3D rotation based on the mouse position
      textRef.current.style.transform = `perspective(600px) rotateY(${
        x / 50
      }deg) rotateX(${y / 50}deg)`;
    }
  };

  const handleMouseLeave = () => {
    // Reset the transformation when the mouse leaves
    if (textRef.current) {
      textRef.current.style.transform =
        "perspective(600px) rotateY(0deg) rotateX(0deg)";
    }
  };

  return (
    <header
      id="home"
      className="relative h-screen flex flex-col items-center justify-center bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/images/header-bg.jpg')" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-8 items-center">
        <div className="text-center">
          <h2 className="text-2xl text-white opacity-80 mb-8 capitalize italic font-medium">
            Provides with maximum efforts
          </h2>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-5 relative">
            WELCOME TO{" "}
            <div
              ref={textRef}
              className="inline-block relative transition-transform duration-300"
              style={{ display: "inline-block" }}
            >
              {/* Single 3D text element */}
              PM<span className="text-[#f27821]">X</span>
            </div>
          </h1>

          <div className="flex justify-center space-x-4">
            <a
              className="bg-[#f27821] text-white py-3 px-8 rounded-full font-semibold transition duration-200 hover:bg-[#1f2a4c] flex items-center"
              href="#download"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Scroll down arrow */}
      <div className="absolute bottom-8 flex flex-col items-center animate-bounce w-8 sm:w-12">
        <FaChevronDown
          className="text-white text-3xl mb-[.5px]"
          style={{ width: "2.5em" }}
        />
        <FaChevronDown
          className="text-white text-3xl mb-[.5px] opacity-75"
          style={{ width: "2.5em" }}
        />
        <FaChevronDown
          className="text-white text-3xl opacity-50"
          style={{ width: "2.5em" }}
        />
      </div>
    </header>
  );
};

export default HeroSection;
