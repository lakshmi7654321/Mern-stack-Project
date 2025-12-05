import React, { useState } from "react";
import { contactDetails } from "../../../utils/constant";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const API_URL = "http://localhost:5000/api/contacts"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg("Your message has been sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMsg(data.message || "Failed to send message. Try again.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setErrorMsg("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-green-200 py-20 px-6 md:px-16 overflow-hidden">
      <div className="relative max-w-7xl mx-auto bg-white backdrop-blur-xl border border-green-200 rounded-3xl shadow-xl p-10 md:p-16">
       
        <div className="text-center mb-14">
          <h2 className="text-5xl md:text-6xl font-extrabold text-black mb-4">
            {contactDetails.title}
          </h2>
          <p className="text-black text-lg md:text-xl">
            {contactDetails.subtitle || "We’re here to help! Fill out the form or reach us directly."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
          <div className="flex justify-center">
            <img
              src="https://tse3.mm.bing.net/th/id/OIP.dxmu1YBjhwwokE-Bg0pqaQHaHa?pid=Api&h=220&P=0"
              alt="Contact Illustration"
              className="w-full h-130 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>

         
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-2xl p-8 space-y-6 border border-gray-100"
          >
            <div>
              <label className="block text-gray-800 font-semibold mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">Your Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

           
            {errorMsg && <p className="text-red-600 font-medium">{errorMsg}</p>}
            {successMsg && <p className="text-green-700 font-semibold text-center">{successMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 shadow-md transition duration-300"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

       
        <div className="mt-24 text-center">
          <h3 className="text-4xl font-extrabold text-black mb-4">Get in Touch</h3>
          <p className="text-black text-lg mb-10">
            Feel free to connect with us anytime through the following channels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-800 text-lg">
            <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
              <span className="text-green-700 text-2xl font-bold">📧</span>
              <p className="mt-3">
                <span className="font-semibold text-green-700">Email:</span> {contactDetails.email}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
              <span className="text-green-700 text-2xl font-bold">📞</span>
              <p className="mt-3">
                <span className="font-semibold text-green-700">Phone:</span> {contactDetails.phone}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
              <span className="text-green-700 text-2xl font-bold">📍</span>
              <p className="mt-3">
                <span className="font-semibold text-green-700">Address:</span> {contactDetails.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
