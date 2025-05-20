import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { Plus, Users } from "lucide-react";

const GroupStudy: React.FC = () => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Math Masters",
      description: "Advanced calculus study group for university students.",
    },
    {
      id: 2,
      name: "Physics Forum",
      description: "Weekly physics problem-solving sessions.",
    },
    {
      id: 3,
      name: "CS Study Hub",
      description: "Programming practice and algorithm discussions.",
    },
  ]);

  const openCreateGroupModal = () => {
    // Implementation of opening the create group modal
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-x-hidden">
      {/* Animated glowing header */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-2 animate-pulse">
          <Users
            size={48}
            className="text-blue-400 drop-shadow-[0_0_24px_rgba(59,130,246,0.8)]"
          />
        </div>
        <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_12px_rgba(59,130,246,0.7)] mb-1 tracking-tight">
          Group Study
        </h2>
        <p className="text-blue-200 text-lg font-medium drop-shadow mb-2">
          "Learning together, growing together!"
        </p>
      </div>
      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="backdrop-blur bg-gray-800/60 border border-blue-500/30 shadow-lg hover:shadow-blue-500/30 hover:border-blue-500/60 transition-all duration-300 rounded-2xl"
          >
            <CardHeader className="flex items-center gap-3">
              <Users
                className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse"
                size={32}
              />
              <CardTitle className="text-white text-xl font-semibold tracking-tight">
                {group.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-blue-200 mb-2 text-base">
                {group.description}
              </div>
              <Button className="mt-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow hover:shadow-blue-500/25 transition-all duration-300 w-full rounded-lg font-semibold tracking-tight">
                Join Group
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-pulse">
        <Button
          onClick={openCreateGroupModal}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 rounded-full px-6 py-3 text-lg font-bold"
        >
          <Plus size={24} className="mr-2" />
          Create Group
        </Button>
      </div>
      {/* Create Group Modal (not implemented in fallback) */}
    </div>
  );
};

export default GroupStudy;
