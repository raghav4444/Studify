import React from "react";
import { useStudyContext } from "./../context/StudyContext";
import SubjectCard from "./SubjectCard";
import { BookOpen } from "lucide-react";

const SubjectList: React.FC = () => {
  const { subjects } = useStudyContext();

  if (subjects.length === 0) {
    return (
      <div className="glass-card border-2 border-neon-blue shadow-neon p-10 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-blue via-blue-500 to-purple-500 flex items-center justify-center shadow-neon animate-pulse">
            <BookOpen size={40} className="text-white drop-shadow-neon" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-neon-blue mb-2 drop-shadow-neon">
          No subjects added yet
        </h3>
        <p className="text-blue-200 max-w-md mx-auto text-lg">
          Start by adding a subject and its exam date. Then you can add
          chapters, set their difficulty, and estimate study hours.
        </p>
      </div>
    );
  }

  const sortedSubjects = [...subjects].sort((a, b) => b.priority - a.priority);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {sortedSubjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
};

export default SubjectList;
