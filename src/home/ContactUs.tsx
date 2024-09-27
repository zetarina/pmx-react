import React, { useState } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactUsSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div
      id="contactus"
      className="py-24 bg-cover bg-center text-center lg:text-left bg-[#28305c]"
      style={{
        backgroundImage: "url('/images/map-image.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white text-center uppercase">
          Contact Us
        </h2>
        <h6 className="text-xl mb-8 text-gray-500 text-center">
          Don’t Be Shy—We’re Here to Help!
        </h6>
        <form onSubmit={handleSubmit} className="flex flex-wrap max-w-6xl  mx-auto">
          <div className="w-full md:w-1/2 p-2">
            <div className="w-full mb-4">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                placeholder="Your Name"
              />
            </div>
            <div className="w-full mb-4">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                placeholder="Your Email"
              />
            </div>
            <div className="w-full mb-4">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                placeholder="Your Phone Number"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 mb-4 flex flex-col p-2">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
              placeholder="Your Message"
              rows={4}
            />
          </div>

          <div className="flex items-center justify-center w-full">
            <button
              type="submit"
              className="bg-[#f27821] text-white rounded-lg  transition mt-4 py-4 px-10 shadow-md capitalize font-extrabold"
            >
              SEND MESSAGE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUsSection;
