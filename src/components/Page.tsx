// Page.js
import React from "react";
import { Helmet } from "react-helmet-async";

interface PageProps {
  title: string;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
  return (
    <div className="w-full">
      <Helmet>
        <title>PMX - {title}</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Helmet>
      <h1 className="pl-20 text-2xl font-bold mb-4 w-full bg-gray-900 text-white p-6">
        {title}
      </h1>
      <div className="p-4 mx-auto">{children}</div>
    </div>
  );
};

export default Page;
