import React from "react";
import { aboutContent } from "../../../utils/constant";


const AboutSection = () => {
  
  return (
    <section
      id="about"
      className="relative bg-white text-black py-24 overflow-hidden"
      style={{
        backgroundImage: `url(${aboutContent.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
     
      <div className="absolute inset-0 bg-white/80"></div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center gap-10 px-6 md:px-12 text-center">
    
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-6 leading-tight">
            {aboutContent.title}
          </h2>
          <p className="text-lg md:text-2xl text-gray-800 leading-relaxed mb-10">
            {aboutContent.description}
          </p>

          <button
             onClick={() => {
             document.getElementById("reviews")?.scrollIntoView({
             behavior: "smooth",
          });
     }}
            className="bg-red-600 text-white px-10 py-4 rounded-full font-semibold shadow-md hover:bg-green-700 transition duration-300"
          >
          Explore Now
         </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
