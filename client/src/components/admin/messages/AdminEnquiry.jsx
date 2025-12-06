import React, { useState, useEffect } from "react";
import { Mail, ReplyIcon, SearchIcon, Trash2, X } from "lucide-react";

const AdminEnquiry = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyModal, setReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");

const API_URL = "https://mern-stack-project-1-ahdo.onrender.com/api/contacts";

  // ================================
  // Fetch Messages
  // ================================
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        setMessages(data.data || []);

        // Auto-select first message
        if (data?.data?.length > 0) {
          setSelectedMsg(data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, []);

  // Update list after delete
  const updateMessagesState = (updated) => {
    setMessages(updated);

    if (!updated.some((msg) => msg._id === selectedMsg?._id)) {
      setSelectedMsg(null);
    }
  };

  // ================================
  // Delete Message
  // ================================
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const updated = messages.filter((msg) => msg._id !== id);
      updateMessagesState(updated);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // ================================
  // Reply Message
  // ================================
  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      const res = await fetch(`${API_URL}/${selectedMsg._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replied: true, replyText }),
      });

      const updatedMsg = await res.json();

      if (updatedMsg.success) {
        const updated = messages.map((msg) =>
          msg._id === updatedMsg.data._id ? updatedMsg.data : msg
        );

        setMessages(updated);
        setReplyModal(false);
        setReplyText("");
      } else {
        console.error("Failed to reply:", updatedMsg.message);
      }
    } catch (error) {
      console.error("Reply failed:", error);
    }
  };

  // ================================
  // Search Filter
  // ================================
  const filteredMessages = messages.filter(
    (msg) =>
      msg?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg?.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMessages = messages.length;
  const totalReplied = messages.filter((msg) => msg.replied).length;

  const cards = [
    { title: "Total Messages", value: totalMessages, color: "bg-blue-500" },
    { title: "Replied Messages", value: totalReplied, color: "bg-green-500" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header + Search */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">User Enquiries</h1>

        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`p-6 rounded-xl text-white shadow-lg transition transform hover:scale-105 ${c.color}`}
          >
            <h2 className="text-xl font-semibold">{c.title}</h2>
            <p className="text-3xl mt-2 font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Message List */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => setSelectedMsg(msg)}
                className={`bg-white border rounded-2xl p-4 cursor-pointer hover:shadow-md transition ${
                  selectedMsg?._id === msg._id
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="text-blue-500" size={18} />
                    {msg.name}

                    {msg.replied && (
                      <span className="text-green-600 text-sm font-semibold">(Replied)</span>
                    )}
                  </h3>

                  <span className="text-gray-500 text-sm">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "-"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm">{msg.email}</p>
                <p className="text-gray-700 mt-2 line-clamp-2">{msg.message}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No messages found.</p>
          )}
        </div>

        {/* Right: Message View */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md border">
          {selectedMsg ? (
            <>
              <h2 className="text-2xl font-bold mb-3">{selectedMsg.name}'s Message</h2>

              <p className="text-gray-600 mb-1">
                <strong>Email:</strong> {selectedMsg.email}
              </p>

              <p className="text-gray-500 mb-4">
                {selectedMsg.createdAt ? new Date(selectedMsg.createdAt).toLocaleString() : "-"}
              </p>

              <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border">
                {selectedMsg.message}
              </p>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={() => setReplyModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <ReplyIcon size={18} /> Reply
                </button>

                <button
                  onClick={() => handleDelete(selectedMsg._id)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center mt-10">
              Click a message from the left to view details.
            </p>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal && selectedMsg && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">
            <button
              onClick={() => setReplyModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-4">Reply to {selectedMsg.name}</h3>

            <textarea
              className="w-full border p-3 rounded-lg h-40 mb-4 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReplyModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleReply}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiry;
