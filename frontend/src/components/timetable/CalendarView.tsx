import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Subject, StudySession } from "../../types/index copy";
import { formatDate, getWeekDates } from "../../utils/planner";
import { useStudyContext } from "./../context/StudyContext";
import Button from "../ui/Button";

interface CalendarViewProps {
  sessions: StudySession[];
  subjects: Subject[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ sessions, subjects }) => {
  const { updateSession } = useStudyContext();
  const [currentWeek, setCurrentWeek] = useState<string[]>(getWeekDates());
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    const dates: string[] = [];
    const today = new Date();

    // Calculate the date of Monday for the current offset
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }

    setCurrentWeek(dates);
  }, [weekOffset]);

  const navigateWeek = (direction: number) => {
    setWeekOffset((prev) => prev + direction);
  };

  const toggleSessionCompletion = (session: StudySession) => {
    updateSession({
      ...session,
      completed: !session.completed,
    });
  };

  const getDayLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateObj = new Date(dateString);
    dateObj.setHours(0, 0, 0, 0);

    if (dateObj.getTime() === today.getTime()) {
      return "Today";
    }

    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getSessionsForDay = (dateString: string) => {
    return sessions.filter((session) => session.date === dateString);
  };

  const getSubjectById = (id: string) => {
    return subjects.find((subject) => subject.id === id);
  };

  const getChapterById = (subjectId: string, chapterId: string) => {
    const subject = getSubjectById(subjectId);
    return subject?.chapters.find((chapter) => chapter.id === chapterId);
  };

  const isWeekend = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const isCurrentDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    return date.getTime() === today.getTime();
  };

  return (
    <div className="space-y-4">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateWeek(-1)}
          className="border-blue-500/20 text-blue-400 hover:border-blue-500/40 hover:bg-gray-700/50"
        >
          <ChevronLeft size={16} />
        </Button>
        <h3 className="text-lg font-semibold text-white">
          {formatDate(currentWeek[0])} - {formatDate(currentWeek[6])}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateWeek(1)}
          className="border-blue-500/20 text-blue-400 hover:border-blue-500/40 hover:bg-gray-700/50"
        >
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center py-2 text-sm font-medium text-blue-300"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {currentWeek.map((dateString) => {
          const daySessions = sessions.filter(
            (session) =>
              new Date(session.date).toDateString() ===
              new Date(dateString).toDateString()
          );

          return (
            <div
              key={dateString}
              className="min-h-[100px] p-2 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 bg-gray-800/50 hover:bg-gray-700/50"
            >
              <div className="text-sm text-blue-200 mb-2">
                {new Date(dateString).getDate()}
              </div>
              <div className="space-y-1">
                {daySessions.map((session) => {
                  const subject = subjects.find(
                    (s) => s.id === session.subjectId
                  );
                  const chapter = subject?.chapters.find(
                    (c) => c.id === session.chapterId
                  );

                  return (
                    <div
                      key={session.id}
                      className="text-xs p-1 rounded bg-blue-900/50 text-blue-200 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
                    >
                      <div className="font-medium">
                        {subject?.name || "Unknown Subject"}
                      </div>
                      <div className="text-blue-300/80">
                        {chapter?.name || "No Chapter"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
