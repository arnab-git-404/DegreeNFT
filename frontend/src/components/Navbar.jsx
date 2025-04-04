// 4th Edition 7.30pm - 12/03/25
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import { WalletButton } from "./WalletButton";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { path: "/university", label: "Universities" },
    { path: "/student", label: "Students" },
    { path: "/verify", label: "Verify Credentials" },
  ];

  return (
    <>
      <nav className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-indigo-500" />
              <span className="text-xl font-bold">DegreeNFT</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">


              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-300 hover:text-white relative group"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gray-300 group-hover:bg-indigo-500 group-hover:w-full group-hover:left-0 transition-all duration-300 transform -translate-x-1/2 group-hover:translate-x-0"></span>
                </Link>
              ))}


              <div className="hidden md:block">
                <WalletButton />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <div className="mr-2">
                <WalletButton />
              </div>

              {/* <button
                className="ml-2 text-gray-300 hover:text-white focus:outline-none relative z-50"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <div className=" hover:cursor-pointer relative w-6 h-6 flex items-center justify-center">

                  <Menu
                    className={`h-6 w-6 absolute transition-all duration-300 ${
                      isMenuOpen
                        ? "opacity-0 transform rotate-90"
                        : "opacity-100 transform rotate-0"
                    }`}
                  />
                  <X
                    className={`h-6 w-6 absolute transition-all duration-300 ${
                      isMenuOpen
                        ? "opacity-100 transform rotate-0"
                        : "opacity-0 transform rotate-90"
                    }`}
                  />
                </div>
              </button> */}

              <button
                className="ml-2 text-gray-300 hover:text-white focus:outline-none relative z-50"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <div className="hover:cursor-pointer relative w-6 h-6 flex items-center justify-center overflow-hidden">
                  <Menu
                    className={`h-6 w-6 absolute transition-all duration-500 ease-in-out transform ${
                      isMenuOpen
                        ? "opacity-0 rotate-180 scale-0"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <X
                    className={`h-6 w-6 absolute transition-all duration-500 ease-in-out transform ${
                      isMenuOpen
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-180 scale-0"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu components - positioned below the navbar */}
      {/* Overlay for mobile menu */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      {/* Side panel mobile navigation */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 z-40 md:hidden shadow-2xl 
                  transform transition-transform duration-300 ease-in-out
                  ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">

          {/* Navigation links */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-300 hover:text-white px-2 py-2 rounded hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom section with additional content */}
          <div className="p-4 border-t border-gray-700 text-white ">
            <p className="text-center font-semibold ">DegreeNFT</p>
          </div>

          
        </div>
      </div>
    </>
  );
}

// 3rd Edition
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { GraduationCap, Menu, X } from 'lucide-react';
// import { WalletButton } from './WalletButton';

// export function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const navLinks = [
//     { path: "/university", label: "Universities" },
//     { path: "/student", label: "Students" },
//     { path: "/verify", label: "Verify Credentials" },
//   ];

//   return (
//     <nav className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           <Link to="/" className="flex items-center space-x-2">
//             <GraduationCap className="h-8 w-8 text-indigo-500" />
//             <span className="text-xl font-bold">DegreeNFT</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-6">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className="text-gray-300 hover:text-white relative group"
//               >
//                 <span>{link.label}</span>
//                 <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gray-300 group-hover:bg-indigo-500 group-hover:w-full group-hover:left-0 transition-all duration-300 transform -translate-x-1/2 group-hover:translate-x-0"></span>
//               </Link>
//             ))}

//             <div className="hidden md:block">
//               <WalletButton />
//             </div>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">

//             <div className="mr-2">
//               <WalletButton />
//             </div>
//             <button
//               className="ml-2 text-gray-300 hover:text-white focus:outline-none"
//               onClick={toggleMenu}
//             >
//               {isMenuOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {isMenuOpen && (
//         <div className="md:hidden border-t border-gray-700 bg-gray-900/90 backdrop-blur-lg">
//           <div className="container mx-auto px-4 py-3">
//             <div className="flex flex-col space-y-4 pt-2 pb-3">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className="text-gray-300 hover:text-white px-2 py-2 rounded hover:bg-gray-800 transition-colors"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// 2nd Edition
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { GraduationCap, Menu, X } from 'lucide-react';
// import { WalletButton } from './WalletButton';

// export function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const navLinks = [
//     { path: "/university", label: "Universities" },
//     { path: "/student", label: "Students" },
//     { path: "/verify", label: "Verify Credentials" },
//   ];

//   return (
//     <nav className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           <Link to="/" className="flex items-center space-x-2">
//             <GraduationCap className="h-8 w-8 text-indigo-500" />
//             <span className="text-xl font-bold">DegreeNFT</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-6">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className="text-gray-300 hover:text-white relative group"
//               >
//                 <span>{link.label}</span>
//                 <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gray-300 group-hover:bg-indigo-500 group-hover:w-full group-hover:left-0 transition-all duration-300 transform -translate-x-1/2 group-hover:translate-x-0"></span>
//               </Link>
//             ))}

//             <WalletButton />
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <WalletButton />

//             <button
//               className="ml-4 text-gray-300 hover:text-white focus:outline-none"
//               onClick={toggleMenu}
//             >
//               {isMenuOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {isMenuOpen && (
//         <div className="md:hidden border-t border-gray-700 bg-gray-900/90 backdrop-blur-lg">
//           <div className="container mx-auto px-4 py-3">
//             <div className="flex flex-col space-y-4 pt-2 pb-3">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className="text-gray-300 hover:text-white px-2 py-2 rounded hover:bg-gray-800 transition-colors"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// 1st Edition
// import { Link } from 'react-router-dom';
// import { GraduationCap } from 'lucide-react';
// import { WalletButton } from './WalletButton';

// export function Navbar() {
//   return (
//     <nav className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           <Link to="/" className="flex items-center space-x-2">
//             <GraduationCap className="h-8 w-8 text-indigo-500" />
//             <span className="text-xl font-bold">DegreeVerify</span>
//           </Link>

//           <div className="flex items-center space-x-6">
//             <Link to="/university" className="text-gray-300 hover:text-white relative group">
//               <span>Universities</span>
//               <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gray-300 group-hover:bg-indigo-500 group-hover:w-full group-hover:left-0 transition-all duration-300 transform -translate-x-1/2 group-hover:translate-x-0"></span>
//             </Link>
//             <Link to="/student" className="text-gray-300 hover:text-white relative group">
//               <span>Students</span>
//               <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gray-300 group-hover:bg-indigo-500 group-hover:w-full group-hover:left-0 transition-all duration-300 transform -translate-x-1/2 group-hover:translate-x-0"></span>
//             </Link>
//             <Link to="/verify" className="text-gray-300 hover:text-white relative group">
//               <span>Verify Credentials</span>
//               <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gray-300 group-hover:bg-indigo-500 group-hover:w-full group-hover:left-0 transition-all duration-300 transform -translate-x-1/2 group-hover:translate-x-0"></span>
//             </Link>

//             <WalletButton />

//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
