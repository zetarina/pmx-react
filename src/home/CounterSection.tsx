import React from "react";
import CountUp from "react-countup";

const CounterSection = () => {
  return (
    <div className="py-16 text-center">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-8">
        <div>
          <p className="text-6xl font-bold text-gray-900">
            <CountUp end={231} duration={2} />
          </p>
          <p className="text-gray-500">Happy Users</p>
        </div>
        <div>
          <p className="text-6xl font-bold text-gray-900">
            <CountUp end={385} duration={2} />
          </p>
          <p className="text-gray-500">Issues Solved</p>
        </div>
        <div>
          <p className="text-6xl font-bold text-gray-900">
            <CountUp end={159} duration={2} />
          </p>
          <p className="text-gray-500">Good Reviews</p>
        </div>
        <div>
          <p className="text-6xl font-bold text-gray-900">
            <CountUp end={127} duration={2} />
          </p>
          <p className="text-gray-500">Case Studies</p>
        </div>
        <div>
          <p className="text-6xl font-bold text-gray-900">
            <CountUp end={211} duration={2} />
          </p>
          <p className="text-gray-500">Orders Received</p>
        </div>
      </div>
    </div>
  );
};

export default CounterSection;
