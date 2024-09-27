import React from "react";
// Updated timeline data with full details
const timelineData = [
  {
    year: "August 2019-2020",
    title: "The Journey Begins",
    description:
      "Our logistics company was founded with a clear mission: to redefine efficiency in the supply chain industry. Starting with a small but dedicated team, we laid the foundation for what would become a rapidly growing operation, driven by innovation and a customer-first approach.",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    year: "2020-2021",
    title: "Navigating the Challenges of COVID-19",
    description:
      "The global pandemic brought unprecedented challenges to the logistics industry, and our company was no exception. Despite the disruptions, we adapted quickly, implementing stringent safety measures and innovative solutions to keep our operations running smoothly. Our team’s resilience and commitment allowed us to continue serving our clients effectively, ensuring that essential goods were delivered even in the most difficult times. The experience strengthened our operations and reinforced our role as a reliable partner in critical times.",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    year: "September 2022",
    title: "Expanding Our Reach",
    description:
      "Just one year after our inception, we successfully scaled our operations, delivering to 10 key local destinations. This year marked a significant milestone as we optimized our delivery networks and enhanced our service offerings to ensure reliable and timely deliveries.",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    year: "July 2024",
    title: "Pioneering Growth and Innovation",
    description:
      "As we move forward, 2024 marks a year of significant growth and development. We are enhancing our logistics capabilities by expanding our fleet, refining our processes, and adopting sustainable practices to reduce our environmental impact. Our focus remains on delivering superior logistics solutions that drive success for our clients.",
    imageUrl: "https://via.placeholder.com/50",
  },
];


const AboutUs = () => {
  return (
    <section id="aboutus" className="container mx-auto py-20 mb-48 px-4 lg:px-8">
      {/* Section Heading */}
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
        About Us
      </h1>
      <h2 className="text-3xl font-semibold text-center mb-16 text-gray-600">
        Milestones in Our Success
      </h2>

      <div className="relative min-h-screen">
        {/* Timeline Notifier Line (Hidden on Mobile) */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full border-l-4 border-gray-300"></div>

        <div className="space-y-36 mt-20 relative hidden md:block">
          {timelineData.map((item, index) => (
            <div
              className="flex flex-col md:flex-row w-full relative"
              key={index}
            >
              {/* Dynamic Alternating Layout for Desktop */}
              <div
                className={`w-full md:w-1/2 ${
                  index % 2 === 0
                    ? "md:ml-auto pl-8 md:pl-28"
                    : "md:mr-auto pr-8 md:pr-28"
                }`}
              >
                <div
                  className={`text-center md:text-${
                    index % 2 === 0 ? "right" : "left"
                  }`}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
                    {item.year}: {item.title}
                  </h3>
                  <p className="text-sm md:text-lg text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Notifier Circle with Image (Responsive) */}
              <div className="absolute left-1/2 transform -translate-x-1/2 bg-gray-200 w-44 h-44 rounded-full flex items-center justify-center shadow-lg">
                <img
                  src={item.imageUrl}
                  alt={`Milestone ${index + 1}`}
                  className="w-44 h-44 rounded-full object-cover"
                />
              </div>
            </div>
          ))}
          <div className="flex flex-col md:flex-row w-full relative">
            {/* Notifier Circle with Image (Responsive) */}
            <div className="bg-[#f27821] text-white font-bold absolute left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
              Now
            </div>
          </div>
        </div>

        {/* Mobile Timeline Design */}
        <div className="md:hidden mt-16 space-y-12 relative">
          {/* Left vertical line for the timeline */}
          <div className="absolute left-8 top-0 h-full border-l-4 border-gray-300"></div>
          {timelineData.map((item, index) => (
            <div
              key={index}
              className="flex items-start text-left pl-12 relative"
            >
              {/* Circle with Image */}
              <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-4 absolute left-8 transform -translate-x-1/2">
                <img
                  src={item.imageUrl}
                  alt={`Milestone ${index + 1}`}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              {/* Year and Title */}
              <div className="ml-8">
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  {item.year}: {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
          <div className="flex items-start text-left pl-12 relative">
            {/* Circle with Image */}
            <div className="bg-[#f27821] text-white font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg mb-4 absolute left-8 transform -translate-x-1/2">
              Now
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
