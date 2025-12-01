import React from "react";
import { chooseData } from "../../../utils/constant"

const ChooseSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-3">
          WHY CHOOSE US?
        </h2>
        <p className="text-black-500 max-w-2xl mx-auto">
          You will choose us because you get the best quality food from us and
          we deliver fast.
        </p>
      </div>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {chooseData.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-2xl p-8 text-center transition-transform transform hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="text-5xl mb-4 text-green-600">{item.icon}</div>
            <h3 className="text-xl font-semibold text-black-800 mb-2">
              {item.title}
            </h3>
            <p className="text-black-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChooseSection;
