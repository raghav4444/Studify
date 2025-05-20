import React, { useMemo, useState } from "react";
import { CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { Subject, StudySession } from "../../types/index copy";
import { formatDate } from "../../utils/planner";
import { useStudyContext } from "./../context/StudyContext";
import Button from "../ui/Button";

interface ListViewProps {
  sessions: StudySession[];
  subjects: Subject[];
}

const ListView: React.FC<ListViewProps> = ({ sessions, subjects }) => {
  const { updateSession } = useStudyContext();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const groups: Record<string, StudySession[]> = {};

    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    sortedSessions.forEach((session) => {
      if (!groups[session.date]) {
        groups[session.date] = [];
      }
      groups[session.date].push(session);
    });

    return groups;
  }, [sessions]);

  const dates = useMemo(() => {
    return Object.keys(groupedSessions).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }, [groupedSessions]);

  const paginatedDates = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return dates.slice(start, end);
  }, [dates, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(dates.length / itemsPerPage);

  const toggleSessionCompletion = (session: StudySession) => {
    updateSession({
      ...session,
      completed: !session.completed,
    });
  };

  const getSubjectById = (id: string) => {
    return subjects.find((subject) => subject.id === id);
  };

  const getChapterById = (subjectId: string, chapterId: string) => {
    const subject = getSubjectById(subjectId);
    return subject?.chapters.find((chapter) => chapter.id === chapterId);
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    return date.getTime() === today.getTime();
  };

  return (
    <div className="space-y-4">
      {/* Date Groups */}
      {paginatedDates.map((date) => (
        <div
          key={date}
          className="rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 bg-gray-800/50 hover:bg-gray-700/50"
        >
          {/* Date Header */}
          <div className="p-4 border-b border-blue-500/20">
            <h3 className="text-lg font-semibold text-white">
              {isToday(date) ? "Today" : formatDate(date)}
            </h3>
          </div>

          {/* Sessions List */}
          <div className="divide-y divide-blue-500/20">
            {groupedSessions[date].map((session) => {
              const subject = getSubjectById(session.subjectId);
              const chapter = getChapterById(
                session.subjectId,
                session.chapterId
              );

              if (!subject || !chapter) return null;

              return (
                <div
                  key={session.id}
                  className="p-4 hover:bg-gray-700/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <h4 className="font-medium text-white">
                          {subject.name}
                        </h4>
                      </div>
                      <p className="text-sm text-blue-300/80 mt-1">
                        {chapter.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-blue-300">
                        {session.duration}{" "}
                        {session.duration === 1 ? "hour" : "hours"}
                      </span>
                      <button
                        onClick={() => toggleSessionCompletion(session)}
                        className={`p-1 rounded-full transition-colors ${
                          session.completed
                            ? "text-green-400 hover:text-green-300"
                            : "text-blue-400 hover:text-blue-300"
                        }`}
                      >
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="border-blue-500/20 text-blue-400 hover:border-blue-500/40 hover:bg-gray-700/50 disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="border-blue-500/20 text-blue-400 hover:border-blue-500/40 hover:bg-gray-700/50 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListView;
