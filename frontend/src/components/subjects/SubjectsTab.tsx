import React from "react";
import SubjectForm from "./SubjectForm";
import SubjectList from "./SubjectList";

const SubjectsTab: React.FC = () => {
  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f] min-h-screen">
      <div className="max-w-5xl mx-auto space-y-10">
        <SubjectForm />
        <SubjectList />
      </div>
    </div>
  );
};

export default SubjectsTab;
