import React, { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, Bell, RotateCcw } from "lucide-react";
import { User as UserType } from "../types";

interface HeaderProps {
  user: UserType;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, setShowSidebar, onReset }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all study data? This action cannot be undone."
      )
    ) {
      onReset();
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <button
          className="mr-4 md:hidden text-gray-500 hover:text-gray-700"
          onClick={() => setShowSidebar((prev) => !prev)}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-indigo-700 hidden md:block">
          Studify
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={handleReset}
          className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
          title="Reset all data"
        >
          <RotateCcw size={20} />
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="font-medium text-gray-800">{user.name}</span>
            <span className="text-xs text-gray-500">Student</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img
                src={
                  user.avatar ||
                  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
                }
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-indigo-100"
              />
              <ChevronDown size={16} className="ml-1 text-gray-500" />
            </button>
            {/* Dropdown removed as per user request */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
