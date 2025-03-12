import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-100 rounded-xl shadow-xl overflow-hidden p-10">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
            404
          </h1>
          
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto my-6"></div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 text-lg mb-8">
            Oops! The page you're looking for doesn't seem to exist in our blockchain.
          </p>
          
          <Link
            to="/"
            className=" pointer-events-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
