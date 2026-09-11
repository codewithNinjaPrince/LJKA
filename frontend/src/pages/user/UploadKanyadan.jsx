import React from "react";

const UploadKanyadan = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#78081C]/10 flex items-center justify-center">
            <span className="text-4xl">🙏</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#78081C] mb-4">
            Upload Kanyadan
          </h1>

          <div className="inline-block px-5 py-2 rounded-full bg-[#78081C] text-white text-sm font-semibold mb-5">
            Coming Soon
          </div>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            The Kanyadan support upload facility is currently under development.
            This service will be available soon through your LJKA member portal.
          </p>

          <p className="mt-5 text-gray-500 text-sm">
            Thank you for your patience and support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadKanyadan;
