// LandingPage.js
import Header from "@/custom-components/Header";
import Link from "next/link";
import React from "react";

function LandingPage() {
  return (
    <div className="bg-gray-100 font-sans">
      {/* Navigation bar */}
      <Header />

      {/* Hero section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Welcome to TherHappy
          </h1>
          <p className="text-lg md:text-xl mb-8">
            A simple and powerful solution for stress relief and anger
            management.
          </p>
          <div>
            <Link
              href="/login"
              className="inline-block bg-white text-blue-600 font-bold px-6 py-4 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Easy to Use</h3>
              <p className="text-gray-700">
                Our app is designed to be intuitive and user-friendly, so you
                can start relaxing right away.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Customizable</h3>
              <p className="text-gray-700">
                Tailor your relaxation experience with customizable settings and
                meditation sessions.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Anywhere, Anytime</h3>
              <p className="text-gray-700">
                Access our app from any device, so you can relax wherever you
                are, whenever you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer section */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <p className="text-center">
            &copy; 2024 TherHappy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
