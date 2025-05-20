import React, { useState } from "react";
import { StudySession, Subject } from "../types/index copy";
import { useStudyContext } from "./context/StudyContext";
import { X } from "lucide-react";

interface AddStudySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (session: Omit<StudySession, "id">) => void;
  subjects: Subject[];
}

const moods = [
  "focused",
  "motivated",
  "neutral",
  "tired",
  "distracted",
] as const;

type Mood = (typeof moods)[number];

const AddStudySessionModal: React.FC<AddStudySessionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  subjects,
}) => {
  console.log(
    "AddStudySessionModal subjects:",
    subjects,
    "length:",
    subjects.length
  );
  const { addSession } = useStudyContext();
  const [subjectId, setSubjectId] = useState<string>("");
  const [duration, setDuration] = useState(30);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [mood, setMood] = useState<Mood>("focused");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      subjectId,
      chapterId: "", // or handle chapter selection if needed
      date,
      duration,
      completed: false,
      mood,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 rounded-lg border border-blue-500/20 shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Add Study Session
            </h2>
            <button
              onClick={onClose}
              className="text-blue-300/70 hover:text-blue-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-blue-300/90 mb-2">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-blue-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-blue-300/90 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700/50 border border-blue-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-blue-300/90 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-blue-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                required
              />
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-medium text-blue-300/90 mb-2">
                Mood
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-blue-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                required
              >
                <option value="focused">Focused</option>
                <option value="tired">Tired</option>
                <option value="motivated">Motivated</option>
                <option value="distracted">Distracted</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-blue-300/90 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-blue-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-blue-300/70 hover:text-blue-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-md hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300"
              >
                Add Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudySessionModal;
