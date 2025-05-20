import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import { Book } from "lucide-react";

const Subject: React.FC = () => {
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "Mathematics",
      description: "A study of numbers, quantities, and space.",
    },
    {
      id: 2,
      name: "History",
      description: "The study of past events and their consequences.",
    },
    {
      id: 3,
      name: "Science",
      description: "The study of the natural world and its phenomena.",
    },
    {
      id: 4,
      name: "English",
      description: "The study of literature and language.",
    },
    {
      id: 5,
      name: "Art",
      description: "The study of visual arts and their elements.",
    },
    {
      id: 6,
      name: "Music",
      description: "The study of music and its elements.",
    },
    {
      id: 7,
      name: "Physical Education",
      description: "The study of physical activity and its benefits.",
    },
    {
      id: 8,
      name: "Computer Science",
      description: "The study of computers and their applications.",
    },
  ]);

  const openCreateSubjectModal = () => {
    // Implementation of openCreateSubjectModal function
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-x-hidden">
      {/* Animated glowing header */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-2 animate-pulse">
          <Book
            size={48}
            className="text-blue-400 drop-shadow-[0_0_24px_rgba(59,130,246,0.8)]"
          />
        </div>
        <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_12px_rgba(59,130,246,0.7)] mb-1 tracking-tight">
          Subjects
        </h2>
        <p className="text-blue-200 text-lg font-medium drop-shadow mb-2">
          "Master your subjects, master your future!"
        </p>
      </div>
      {/* Subjects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            className="backdrop-blur bg-gray-800/60 border border-blue-500/30 shadow-lg hover:shadow-blue-500/30 hover:border-blue-500/60 transition-all duration-300 rounded-2xl"
          >
            <CardHeader className="flex items-center gap-3">
              <Book
                className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse"
                size={32}
              />
              <CardTitle className="text-white text-xl font-semibold tracking-tight">
                {subject.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-blue-200 mb-2 text-base">
                {subject.description}
              </div>
              <Button className="mt-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow hover:shadow-blue-500/25 transition-all duration-300 w-full rounded-lg font-semibold tracking-tight">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-pulse">
        <Button
          onClick={openCreateSubjectModal}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 rounded-full px-6 py-3 text-lg font-bold"
        >
          <Plus size={24} className="mr-2" />
          Add Subject
        </Button>
      </div>
      {/* Create Subject Modal (not implemented in fallback) */}
    </div>
  );
};

export default Subject;
