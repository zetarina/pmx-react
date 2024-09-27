import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Logistics",
      description:
        "Whether by land, sea, or air, our extensive network allows us to offer cost-effective and reliable solutions.",
      image: "/images/Logistics.svg",
    },
    {
      title: "Parcel Management",
      description:
        "We specialize in delivering a seamless parcel management experience that takes the stress out of shipping and receiving. Whether you're a business or an individual, our innovative solutions are designed to cater to all your parcel needs.",
      image: "/images/Parcel Management.svg",
    },
    {
      title: "Wearhousing",
      description:
        "With strategically located warehouses, we provide secure storage and efficient distribution services to help streamline your supply chain.",
      image: "/images/Wearhousing.svg",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50 text-center ">
      <div className="container mx-auto px-4 sm:px-8">
        <h1 className="text-[#28305c] mb-5 text-4xl font-bold">Services</h1>
        <div className="flex flex-wrap">
          {features.map((feature, index) => (
            <div
              key={index}
              className="w-full sm:w-full md:w-1/2 lg:w-1/3 p-4 min-h-96"
            >
              <div className="bg-white p-8 rounded-lg shadow-md transition-transform transform hover:scale-105 h-full">
                <img
                  className="mx-auto mb-6 h-32 w-32"
                  src={feature.image}
                  alt={feature.title}
                />
                <h3 className="text-4xl font-bold text-gray-500 mb-4">
                  {feature.title}
                </h3>
                <p className="text-black text-xl">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
