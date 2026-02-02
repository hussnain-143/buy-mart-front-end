import React from "react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-secondary relative flex items-center justify-center overflow-hidden">
      {/* Simple star field */}
      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full opacity-70 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-10">
        {/* Astronaut emoji or replace with SVG */}
        <div className="text-9xl md:text-[12rem] animate-float">
          🧑‍🚀
        </div>

        <h1 className="text-6xl md:text-8xl font-bold text-primary">404</h1>
        <h2 className="text-4xl text-white">Mission Failed</h2>
        <p className="text-xl text-white/70 max-w-lg mx-auto">
          Our explorer couldn't locate this page in the vast universe of BuyMart.
        </p>

        <NavLink
          to="/"
          className="inline-block px-12 py-5 rounded-xl bg-primary text-secondary text-lg font-semibold hover:opacity-90 transition"
        >
          Return to Base (Home)
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;