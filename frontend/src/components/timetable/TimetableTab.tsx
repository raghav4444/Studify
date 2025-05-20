import React, { useState } from "react";
import { useStudyContext } from "./../context/StudyContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";
import { Calendar, List, Plus } from "lucide-react";
import CalendarView from "./CalendarView";
import ListView from "./ListView";
import AddStudySessionModal from "../AddStudySessionModal";
import { StudySession } from "../../types/index copy";

const TimetableTab: React.FC = () => {
  const { sessions, subjects, generatePlan, addSession } = useStudyContext();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddSession = (session: Omit<StudySession, "id">) => {
    const newSession: StudySession = {
      ...session,
      id: Math.random().toString(36).substr(2, 9),
      // fallback values if needed
      completed: false,
      mood: (session as any).mood || "focused",
      notes: (session as any).notes || "",
    };
    addSession(newSession);
  };

  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-blue-500/20 shadow-xl backdrop-blur">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-900/40 flex items-center justify-center border-4 border-blue-500/40 shadow-lg">
                <Calendar size={32} className="text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
              No study plan generated yet
            </h3>
            <p className="text-blue-200 max-w-md mx-auto mb-6">
              Add subjects and chapters, set your availability, and then
              generate a personalized study plan.
            </p>
            <Button
              onClick={generatePlan}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Generate Study Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-x-hidden">
      {/* Animated glowing header */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-2 animate-pulse">
          <Calendar
            size={48}
            className="text-blue-400 drop-shadow-[0_0_16px_rgba(59,130,246,0.7)]"
          />
        </div>
        <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] mb-1">
          Your Study Schedule
        </h2>
        <p className="text-blue-200 text-lg font-medium drop-shadow mb-2">
          "Plan your work, then work your plan."
        </p>
      </div>
      {/* View Toggle Card */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-blue-500/20 bg-gray-800/70 backdrop-blur p-1 shadow-lg">
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-2 text-base font-semibold rounded-md transition-all duration-300 ${
              view === "calendar"
                ? "bg-blue-500/20 text-blue-300 shadow-md"
                : "text-blue-300/70 hover:text-blue-300 hover:bg-gray-700/50"
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 text-base font-semibold rounded-md transition-all duration-300 ${
              view === "list"
                ? "bg-blue-500/20 text-blue-300 shadow-md"
                : "text-blue-300/70 hover:text-blue-300 hover:bg-gray-700/50"
            }`}
          >
            List
          </button>
        </div>
      </div>
      {/* Content Card */}
      <div className="bg-gray-800/60 rounded-2xl border border-blue-500/20 p-6 shadow-xl mb-12 transition-all duration-300 hover:shadow-blue-500/20">
        {view === "calendar" ? (
          <CalendarView sessions={sessions} subjects={subjects} />
        ) : (
          <ListView sessions={sessions} subjects={subjects} />
        )}
      </div>
      {/* Add Session Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          <Plus size={20} className="mr-2" />
          Add Session
        </Button>
      </div>
      {/* Add Session Modal */}
      <AddStudySessionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSession}
        subjects={subjects}
      />
    </div>
  );
};

export default TimetableTab;
