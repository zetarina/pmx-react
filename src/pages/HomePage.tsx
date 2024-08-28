import React from "react";
import { FaBriefcase, FaUser } from "react-icons/fa";
import heroImage from "../images/banner.jpg";
import pricingImage from "../images/pricing.jpg";

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative text-white px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 overflow-hidden py-48 flex items-center min-h-screen">
        <div className="h-full absolute top-0 left-0 z-0">
          <img
            src={heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 lg:w-3/4 xl:w-2/4">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
            Make the right move with PMXpress Logistic Service.
          </h1>
          <p className="text-xl md:text-2xl mt-4">
            Trust us for all your logistics needs in Thailand and Myanmar.
          </p>
          <a
            href="#tracking-section"
            className="px-8 py-4 bg-white text-[#e37525] border border-white rounded inline-block mt-8 font-semibold hover:bg-[#212e5b] hover:text-white transition duration-200"
          >
            Search Package
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="relative px-4 py-16 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 lg:py-32 bg-[#212e5b] text-white">
        <div className="flex flex-col lg:flex-row lg:-mx-8">
          <div className="w-full lg:w-1/2 lg:px-8">
            <h2 className="text-3xl leading-tight font-bold mt-4">
              PMXpress Logistic Service - Your Reliable Logistics Partner
            </h2>
            <p className="text-lg mt-4 font-semibold">
              Efficient and Secure Logistics Solutions
            </p>
            <p className="mt-2 leading-relaxed">
              PMXpress Logistic Service is your trusted logistics partner,
              providing efficient and secure logistics solutions for businesses
              and individuals. With our extensive experience and commitment to
              excellence, we ensure that your shipments are handled with utmost
              care and delivered on time.
            </p>
            <p className="mt-2 leading-relaxed">
              Whether you need B2B (Business to Business) services, B2C
              (Business to Customer) solutions, or C2C (Customer to Customer)
              deliveries, PMXpress has you covered. We collaborate with various
              industries, including banks, insurance companies, schools,
              institutes, universities, hospitals, and more, offering the
              fairest prices and the best services.
            </p>
          </div>

          <div className="w-full lg:w-1/2 lg:px-8 mt-12 lg:mt-0 flex flex-wrap items-center justify-center">
            <ServiceCard
              icon={<FaBriefcase className="text-white text-xl" />}
              title="B2B (Business to Business)"
              description="We provide the fairest price and best services to companies and corporate businesses."
            />
            <ServiceCard
              icon={<FaUser className="text-white text-xl" />}
              title="B2C (Business to Customer)"
              description="PMXpress offers the best courier service to Online Shops, SMEs, and individual businesses."
            />
            <ServiceCard
              icon={<FaUser className="text-white text-xl" />}
              title="C2C (Customer to Customer)"
              description="We ensure secure, speedy, and specific parcel delivery for individuals with COD services."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative bg-gray-100 p-10">
        <div className="flex flex-col lg:flex-row lg:-mx-8">
          <div className="w-full lg:w-1/2 lg:px-8">
            <h2 className="text-3xl leading-tight font-bold mt-4">
              Pricing Options
            </h2>
            <p className="mt-2 leading-relaxed">
              Choose from our range of affordable pricing options tailored for
              your business needs.
            </p>

            <div className="mt-4">
              <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <tbody>
                  <PricingRow label="Same City" price="2,000 Ks" />
                  <PricingRow label="Outskirt Areas" price="3,000 Ks" />
                  <PricingRow label="Other Cities" price="3,000 Ks" highlight />
                  <PricingRow label="Myawaddy" price="3,500 Ks" />
                  <PricingRow label="Myitkyina" price="4,000 Ks" highlight />
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <img
              src={pricingImage}
              alt="PMXpress Pricing"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Tracking Section */}
      <section
        id="tracking-section"
        className="relative bg-[#e37525] text-white px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-48 flex items-center min-h-screen overflow-hidden"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-moving-blocks opacity-50"></div>
          <div className="absolute inset-0 bg-moving-blocks-2 opacity-30"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-8">Track Your Parcel</h2>
          <input
            type="text"
            placeholder="Enter Parcel ID"
            className="border p-3 w-full text-lg rounded text-black transition-transform duration-300 transform hover:scale-105"
          />
          <button className="mt-3 bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
            Search
          </button>
        </div>
      </section>
    </div>
  );
};

const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="md:flex mt-8 w-full">
    <div className="w-20 h-20 bg-[#e37525] rounded-full flex items-center justify-center">
      <div className="flex items-center justify-center">{icon}</div>
    </div>
    <div className="md:ml-8 mt-4 md:mt-0">
      <h4 className="text-xl font-bold leading-tight">{title}</h4>
      <p className="mt-2 leading-relaxed">{description}</p>
    </div>
  </div>
);

const PricingRow: React.FC<{
  label: string;
  price: string;
  highlight?: boolean;
}> = ({ label, price, highlight = false }) => (
  <tr
    className={highlight ? "bg-[#e37525] text-white" : "bg-white text-gray-700"}
  >
    <td className="px-6 py-4 text-left">{label}</td>
    <td className="px-3 py-4 text-center">-</td>
    <td className="px-6 py-4 text-right">{price}</td>
  </tr>
);

export default HomePage;
