import React, { useState } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useStudyContext } from "./../context/StudyContext";

const SubjectForm: React.FC = () => {
  const { addSubject, addSession, sessions, subjects } = useStudyContext();
  const [name, setName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Subject name is required");
      return;
    }

    if (!examDate) {
      setError("Exam date is required");
      return;
    }

    // Validate that the exam date is in the future
    const selectedDate = new Date(examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Exam date must be in the future");
      return;
    }

    // Prepare data to send
    const dataToSend = {
      subject: name,
      exam_date: examDate,
    };

    try {
      const response = await fetch("http://localhost:8000/api/study-plans/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to send data");
      }

      const json = await response.json();
      console.log("Backend response:", json);

      // Add to context for immediate UI update
      addSubject(name, examDate);

      // Clear form on success
      setName("");
      setExamDate("");
      setError(""); // Clear any previous errors
      alert("Subject added successfully!");

      // After addSubject(name, examDate);
      const today = new Date().toISOString().split("T")[0];
      const subjectObj = subjects.find((s) => s.name === name);
      const defaultSession = {
        id: Math.random().toString(36).substr(2, 9),
        subjectId: subjectObj ? subjectObj.id : `subject-${Date.now()}`,
        chapterId: "", // or null if your type allows
        subject: name,
        duration: 60, // 1 hour
        date: today,
        mood: "focused",
        completed: false,
      };
      addSession(defaultSession);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card border-2 border-neon-blue shadow-neon p-8 max-w-lg mx-auto backdrop-blur-lg"
    >
      <h3 className="font-extrabold text-3xl text-neon-blue mb-6 drop-shadow-neon tracking-tight text-center">
        Add New Subject
      </h3>
      <div className="space-y-6">
        <Input
          label="Subject Name"
          placeholder="e.g., Mathematics"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          className="bg-white/10 text-white border border-neon-blue focus:ring-2 focus:ring-neon-blue focus:border-neon-blue placeholder:text-blue-300"
        />
        <div>
          <label
            htmlFor="examDate"
            className="block text-base font-semibold text-neon-blue mb-2 drop-shadow-neon"
          >
            Exam Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neon-blue">
              <CalendarIcon size={18} />
            </div>
            <input
              type="date"
              id="examDate"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="flex h-12 w-full rounded-lg border-2 border-neon-blue bg-white/10 pl-12 pr-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-neon-blue placeholder:text-blue-300"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        {error && (
          <p className="text-base text-rose-400 font-semibold text-center drop-shadow-neon">
            {error}
          </p>
        )}
        <Button
          type="submit"
          fullWidth
          leftIcon={<Plus size={18} />}
          className="bg-neon-blue text-white font-bold py-3 rounded-lg shadow-neon hover:scale-105 hover:shadow-neon transition-all duration-300 text-lg"
        >
          Add Subject
        </Button>
      </div>
    </form>
  );
};

export default SubjectForm;
