import React from "react";

const VyawasthaList = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-[#78081C] px-6 py-8 text-center text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">
              🏛️
            </div>

            <h1 className="text-2xl md:text-3xl font-bold">
              Vyawastha
            </h1>

            <p className="mt-2 text-sm md:text-base text-white/80">
              LJKA Services &amp; Facilities
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-10 md:px-12 md:py-14 text-center">

            <div className="mb-6 text-5xl">
              🚧
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Coming Soon
            </h2>

            <p className="mt-4 max-w-xl mx-auto text-gray-600 leading-7">
              We are working on bringing useful services and facilities
              to LJKA members. This section will be available soon.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#78081C]/10 px-5 py-2.5 text-sm font-medium text-[#78081C]">
              <span className="h-2 w-2 rounded-full bg-[#78081C] animate-pulse" />
              Under Development
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Lakhdaatar Jeevan Kalyan Association
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VyawasthaList;
