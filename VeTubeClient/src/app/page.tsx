"use client";

import VideoList from "@/components/VideoList";

export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="relative w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center">
            <svg
              className="absolute w-8 h-8 text-white"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Letter V */}
              <path
                d="M25 80L40 20L55 80"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Letter T */}
              <path
                d="M40 20L40 80M20 40H60"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Profile Icon */}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          {/* Placeholder for user profile icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0c.99-1.369 1.516-3.02 1.516-4.646 0-4.14-3.36-7.5-7.5-7.5s-7.5 3.36-7.5 7.5c0 1.626.526 3.277 1.515 4.646"
            />
          </svg>
        </div>
      </header>
      {/* Video List */}
      <div className="p-4">
        <VideoList />
      </div>
    </main>
  );
}
