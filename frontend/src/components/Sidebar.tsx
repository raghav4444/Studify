import React from "react";
import {
  LineChart,
  Clock,
  BookOpen,
  Calendar,
  Award,
  Settings,
  BarChart,
  Users,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  showSidebar,
  setShowSidebar,
  activeTab,
  setActiveTab,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LineChart size={20} /> },
    { id: "timer", label: "Study Timer", icon: <Clock size={20} /> },
    { id: "subjects", label: "Exam Preperation", icon: <BookOpen size={20} /> },
    { id: "timetable", label: "Schedule", icon: <Calendar size={20} /> },
    { id: "achievements", label: "Achievements", icon: <Award size={20} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart size={20} /> },
    { id: "groups", label: "Study Groups", icon: <Users size={20} /> },
    { id: "messages", label: "Messages", icon: <MessageSquare size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-indigo-900 text-white z-30 transition-transform duration-300 transform
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center">
            <BookOpen className="mr-2" />
            Study-Planner
          </h1>
        </div>

        <nav className="mt-6">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`
                    flex items-center w-full px-6 py-3 text-left
                    ${
                      activeTab === item.id
                        ? "bg-indigo-800 border-l-4 border-white"
                        : "hover:bg-indigo-800 border-l-4 border-transparent"
                    }
                    transition-all duration-200
                  `}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowSidebar(false);
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <ul>
            <li>
              <button className="flex items-center w-full px-6 py-3 text-left hover:bg-indigo-800 transition-all duration-200">
                <span className="mr-3">
                  <Settings size={20} />
                </span>
                <span>Settings</span>
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-6 py-3 text-left hover:bg-indigo-800 transition-all duration-200">
                <span className="mr-3">
                  <HelpCircle size={20} />
                </span>
                <span>Help</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
