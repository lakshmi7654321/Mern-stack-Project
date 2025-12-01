import React from "react";
import { FOOTER_CONTENT } from "../src/utils/constant";

const Footer = () => {
  const { menu, help, contact } = FOOTER_CONTENT;

  return (
    <footer className="bg-green-100 py-12 rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
 
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Menu</h3>
          <ul className="space-y-2 text-gray-600">
            {menu.map((item, index) => (
              <li key={index}>
                <a href="#" className="hover:text-green-700 transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Help</h3>
          <ul className="space-y-2 text-gray-600">
            {help.map((item, index) => (
              <li key={index}>
                <a href="#" className="hover:text-green-700 transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact</h3>
          <ul className="space-y-2 text-gray-600">
            <li>{contact.phone}</li>
            <li>{contact.email}</li>
            <li>{contact.address}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Subscribe Our Newsletter
          </h3>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full p-2 rounded-l-md border border-gray-300 focus:outline-none"
            />
            <button className="bg-green-600 text-white px-4 rounded-r-md hover:bg-green-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
