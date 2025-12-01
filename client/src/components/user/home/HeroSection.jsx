import React from "react";
import { useNavigate } from "react-router-dom";
import { heroContent, heroImages } from "../../../utils/constant";

const HeroSection = () => {
  const navigate = useNavigate(); // ✅ Used for page navigation

  return (
    <section className="relative pt-20 md:pt-28 bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 gap-10 z-10">
        
        {/* Left Content */}
        <div className="max-w-xl text-center md:text-left">
          <button className="border border-red-300 rounded-full px-5 py-1 text-sm mb-4 hover:border-green-600 transition">
            Hungry?
          </button>

          <h1 className="text-4xl md:text-6xl font-extrabold text-black leading-tight">
            {heroContent.title} <br />
            <span className="text-green-600">{heroContent.highlight}</span>{" "}
            {heroContent.subtitle}
          </h1>

          <p className="text-black mt-4 text-sm md:text-base leading-relaxed">
            {heroContent.description}
          </p>

          {/* ✅ Buttons Section */}
          <div className="flex gap-4 mt-8 justify-center md:justify-start">
            {heroContent.buttons.map((btn, index) => (
              <button
                key={index}
                onClick={() => {
                  // ✅ Navigate to /menu when any button clicked
                  if (btn.text.toLowerCase().includes("explore")) {
                    navigate("/menu");
                  }
                }}
                className={`${
                  btn.type === "primary"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "border border-gray-400 text-black hover:border-green-500"
                } px-6 py-3 rounded-full transition font-medium`}
              >
                {btn.text}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content (Hero Images) */}
        <div className="relative mt-8 md:mt-0 w-full md:w-1/2 flex justify-center">
          <div className="relative flex items-center justify-center -translate-y-8 md:-translate-y-16">
            
            {/* Main Circle Image */}
            <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] rounded-full border-[10px] border-white shadow-2xl overflow-hidden bg-white animate-float-slow">
              <img
                src={heroImages.main}
                alt="Main Dish"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Floating Small Images */}
            {heroImages.floating.map((img, i) => (
              <div
                key={img.id}
                className={`absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white transition-transform duration-500 hover:scale-110 animate-float-slow ${
                  i === 0
                    ? "top-[-40px] left-[50%] -translate-x-1/2"
                    : i === 1
                    ? "bottom-[-60px] right-[70px]"
                    : i === 2
                    ? "bottom-[60px] left-[-60px]"
                    : "top-[50px] right-[-50px]"
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
