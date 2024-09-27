import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ParcelTrackingSection = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      navigate(`/tracking/${trackingCode}`);
    }
  };

  return (
    <section
      id="tracking"
      className="flex items-center justify-center bg-white my-2 min-h-screen h-full"
    >
      <div className="container mx-auto px-4 sm:px-8 xl:px-4">
        <h1 className="mt-10 font-bold uppercase text-[#28305c] text-4xl leading-10 text-center tracking-wider">
          Tracking
        </h1>
        <p className=" text-gray-500 italic font-light text-center mb-6 ">
          Find out where your parcel is
        </p>
        <form
          id="trackingform"
          onSubmit={handleSubmit}
          className="relative max-w-xl mx-auto mt-8"
        >
          <input
            type="search"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            id="default-search"
            className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-full"
            placeholder="Enter Tracking Code"
            required
          />
          <button
            type="submit"
            className="absolute right-2.5 bottom-2.5 bg-[#28305c] text-white font-medium text-sm px-4 py-2 rounded-full hover:bg-[#1e2a46] transition duration-300"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export default ParcelTrackingSection;
