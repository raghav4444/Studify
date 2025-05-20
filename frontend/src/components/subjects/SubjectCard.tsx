import React, { useState } from "react";
import {
  CalendarIcon,
  PlusCircle,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Subject } from "../../types/index copy";
import { formatDate } from "../../utils/planner";
import { Card, CardContent, CardHeader } from "../ui/Card";
import Button from "../ui/Button";
import { useStudyContext } from "./../context/StudyContext";
import ChapterList from "./ChapterList";
import ChapterForm from "./ChapterForm";

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const { deleteSubject } = useStudyContext();
  const [showChapters, setShowChapters] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);

  const completedChapters = subject.chapters.filter(
    (ch) => ch.completed
  ).length;
  const totalChapters = subject.chapters.length;
  const progress =
    totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${subject.name}?`)) {
      deleteSubject(subject.id);
    }
  };

  const toggleChapters = () => {
    setShowChapters(!showChapters);
    if (!showChapters) {
      setShowAddChapter(false);
    }
  };

  return (
    <Card className="glass-card border-2 border-neon-blue shadow-neon overflow-hidden transition-all duration-200 hover:scale-[1.025] hover:shadow-neon-lg">
      <CardHeader className="flex flex-row items-center justify-between p-6 bg-white/5">
        <div className="flex items-center space-x-3 w-full">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-neon-blue via-blue-500 to-purple-500 shadow-neon animate-pulse">
            <BookOpen size={20} className="text-white drop-shadow-neon" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-neon-blue drop-shadow-neon mb-1">
              {subject.name}
            </h3>
            <div className="flex items-center text-sm text-blue-200 font-semibold">
              <CalendarIcon size={14} className="mr-1 text-neon-blue" />
              <span>{formatDate(subject.examDate)}</span>
              {subject.priority > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded text-xs font-bold border border-amber-400/40">
                  Priority: {subject.priority.toFixed(1)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={handleDelete}
              className="p-2 text-blue-200 hover:text-rose-400 transition-colors hover:scale-110"
              aria-label="Delete subject"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={toggleChapters}
              className="p-2 text-blue-200 hover:text-neon-blue transition-colors hover:scale-110"
              aria-label={showChapters ? "Hide chapters" : "Show chapters"}
            >
              {showChapters ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 bg-white/5">
        <div className="flex justify-between items-center mb-3">
          <div className="text-base text-blue-100 font-medium">
            {totalChapters > 0 ? (
              <span>
                {completedChapters} of {totalChapters} chapters completed
              </span>
            ) : (
              <span>No chapters added yet</span>
            )}
          </div>
          <div className="text-base font-bold text-neon-blue">
            {progress > 0 ? `${Math.round(progress)}%` : "0%"}
          </div>
        </div>
        <div className="w-full bg-blue-900/40 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-neon-blue via-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out shadow-neon"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </CardContent>

      {showChapters && (
        <div className="border-t border-blue-900/40 bg-white/5">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-neon-blue drop-shadow-neon text-lg">
                Chapters
              </h4>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<PlusCircle size={16} />}
                onClick={() => setShowAddChapter(!showAddChapter)}
                className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 hover:scale-105"
              >
                {showAddChapter ? "Cancel" : "Add Chapter"}
              </Button>
            </div>

            {showAddChapter && (
              <div className="mb-4">
                <ChapterForm
                  subjectId={subject.id}
                  onComplete={() => setShowAddChapter(false)}
                />
              </div>
            )}

            <ChapterList subject={subject} />
          </div>
        </div>
      )}
    </Card>
  );
};

export default SubjectCard;
