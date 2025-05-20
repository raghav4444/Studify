import React, { useState } from "react";
import { StudySession, Subject } from "../types/index copy";
import { User, DailyStats } from "../types";
import {
  Clock,
  Calendar,
  Award,
  Zap,
  TrendingUp,
  Book,
  Plus,
  Trash2,
} from "lucide-react";
import {
  formatTime,
  calculateDailyStats,
  groupBySubject,
} from "../utils/helpers";
import StudyChart from "./StudyChart";
import StudySessionCard from "./StudySessionCard";
import SubjectDistribution from "./SubjectDistribution";
import { StudyPlan } from "../utils/api";
import api from "../utils/api";
import AddStudySessionModal from "./AddStudySessionModal";
import { useStudyContext } from "./context/StudyContext";

interface DashboardProps {
  user: User;
  onReset: () => void;
  setActiveTab: (tab: string) => void;
  studyPlans: StudyPlan[];
  fetchStudyPlans: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  onReset,
  setActiveTab,
  studyPlans,
  fetchStudyPlans,
  isLoading,
  error,
}) => {
  const { sessions, syncStudyPlans, subjects, addSession } = useStudyContext();
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  console.log(sessions);

  // Map sessions to include subject and mood for compatibility with helpers
  const mappedSessions = sessions.map((s) => ({
    ...s,
    subject: subjects.find((sub) => sub.id === s.subjectId)?.name || "Unknown",
    mood: (s as any).mood || "focused",
    duration: s.duration,
  }));

  const dailyStats: DailyStats[] = calculateDailyStats(mappedSessions);
  const recentSessions = [...mappedSessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const today = new Date().toISOString().split("T")[0];
  const todaySessions = sessions.filter((session) => session.date === today);
  const todayMinutes = todaySessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekSessions = sessions.filter(
    (session) => new Date(session.date) >= oneWeekAgo
  );
  const weekMinutes = weekSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  const subjectDistribution = groupBySubject(mappedSessions);

  // Calculate current streak based on actual study days (not just from user prop)
  // Assumes sessions are sorted by date descending
  const uniqueStudyDates = Array.from(
    new Set(sessions.map((s) => s.date))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  let currentDate = new Date(today);

  for (let i = 0; i < uniqueStudyDates.length; i++) {
    const studyDate = new Date(uniqueStudyDates[i]);
    if (
      studyDate.toISOString().split("T")[0] ===
      currentDate.toISOString().split("T")[0]
    ) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Use calculated streak instead of user.currentStreak
  user = { ...user, currentStreak: streak };

  const handleSessionAdded = () => {
    fetchStudyPlans();
  };

  const handlePlanCreated = () => {
    setActiveTab("subjects");
  };

  const handleDeletePlan = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this study plan?")) {
      try {
        await api.deleteStudyPlan(id);
        fetchStudyPlans(); // Refresh the list after deletion
      } catch (err) {
        alert("Failed to delete study plan.");
      }
    }
  };

  // Add this function to handle deleting all study plans
  const handleDeleteAllPlans = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete ALL study plans? This cannot be undone."
      )
    ) {
      try {
        await Promise.all(
          studyPlans.map((plan) => api.deleteStudyPlan(plan.id))
        );
        fetchStudyPlans();
      } catch (err) {
        alert("Failed to delete all study plans.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!Array.isArray(studyPlans)) {
    return <div className="text-red-500">Study plans data is invalid.</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f] min-h-screen">
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-[0_0_16px_#00eaff,0_0_32px_#00eaff99] tracking-tight flex items-center gap-3 relative z-10">
            <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue via-blue-500 to-purple-500 shadow-[0_0_16px_#00eaff,0_0_32px_#00eaff99] animate-pulse"></span>
            Hello, {user.name}! <span className="animate-wave">👋</span>
            <span
              className="absolute left-0 -bottom-3 w-full h-2 bg-gradient-to-r from-neon-blue via-blue-400 to-purple-500 rounded-full blur-[2px] animate-pulse opacity-90"
              style={{ zIndex: 1 }}
            ></span>
          </h2>
        </div>
        <p className="text-slate-200 mt-6 text-xl font-semibold drop-shadow-[0_0_8px_#00eaff]">
          Here's an overview of your study progress and statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="glass-card border-l-4 border-neon-blue shadow-neon p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-200 font-medium mb-1">
                Today's Study Time
              </p>
              <h3 className="text-2xl font-semibold text-white">
                {formatTime(todayMinutes)}
              </h3>
            </div>
            <div className="bg-[#172554]/60 p-3 rounded-lg shadow-neon">
              <Clock size={24} className="text-neon-blue drop-shadow-neon" />
            </div>
          </div>
        </div>
        <div className="glass-card border-l-4 border-cyan-400 shadow-neon p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-200 font-medium mb-1">
                Weekly Study Time
              </p>
              <h3 className="text-2xl font-semibold text-white">
                {formatTime(weekMinutes)}
              </h3>
            </div>
            <div className="bg-[#164e63]/60 p-3 rounded-lg shadow-neon">
              <Calendar size={24} className="text-cyan-400 drop-shadow-neon" />
            </div>
          </div>
        </div>
        <div className="glass-card border-l-4 border-purple-500 shadow-neon p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-200 font-medium mb-1">Current Streak</p>
              <h3 className="text-2xl font-semibold text-white">
                {user.currentStreak} days
              </h3>
            </div>
            <div className="bg-[#581c87]/60 p-3 rounded-lg shadow-neon">
              <Zap size={24} className="text-purple-400 drop-shadow-neon" />
            </div>
          </div>
        </div>
        <div className="glass-card border-l-4 border-amber-400 shadow-neon p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-200 font-medium mb-1">Total Study Time</p>
              <h3 className="text-2xl font-semibold text-white">
                {formatTime(user.totalStudyHours * 60)}
              </h3>
            </div>
            <div className="bg-[#78350f]/60 p-3 rounded-lg shadow-neon">
              <Award size={24} className="text-amber-400 drop-shadow-neon" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="lg:col-span-2 glass-card shadow-neon p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-neon-blue drop-shadow-neon flex items-center gap-2 relative">
              <TrendingUp
                size={24}
                className="mr-1 text-neon-blue drop-shadow-neon"
              />
              Study Activity
              <span className="absolute left-0 -bottom-1 w-32 h-1 bg-gradient-to-r from-neon-blue via-blue-400 to-purple-500 rounded-full blur-[1px] animate-pulse opacity-80"></span>
            </h3>
            <select className="text-sm border rounded-md py-1 px-3 bg-[#1e293b] text-white border-neon-blue focus:ring-neon-blue">
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div className="h-64">
            <StudyChart dailyStats={dailyStats.slice(0, 7).reverse()} />
          </div>
        </div>
        <div className="glass-card shadow-neon p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <Book size={24} className="mr-2 text-neon-blue drop-shadow-neon" />
            <h3 className="text-2xl font-bold text-neon-blue drop-shadow-neon relative">
              Subject Distribution
              <span className="absolute left-0 -bottom-1 w-40 h-1 bg-gradient-to-r from-neon-blue via-blue-400 to-purple-500 rounded-full blur-[1px] animate-pulse opacity-80"></span>
            </h3>
          </div>
          <div className="h-64">
            <SubjectDistribution data={subjectDistribution} />
          </div>
        </div>
      </div>

      <div className="glass-card shadow-neon p-4 sm:p-6 mb-6">
        <h3 className="text-2xl font-bold text-neon-blue mb-4 drop-shadow-neon relative">
          Recent Study Sessions
          <span className="absolute left-0 -bottom-1 w-56 h-1 bg-gradient-to-r from-neon-blue via-blue-400 to-purple-500 rounded-full blur-[1px] animate-pulse opacity-80"></span>
        </h3>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <StudySessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400 py-6 text-center">
            No recent study sessions found.
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-neon-blue drop-shadow-neon relative">
          Study Plans
          <span className="absolute left-0 -bottom-1 w-40 h-1 bg-gradient-to-r from-neon-blue via-blue-400 to-purple-500 rounded-full blur-[1px] animate-pulse opacity-80"></span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteAllPlans}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-neon transition-colors"
          >
            <Trash2 size={20} className="mr-2" />
            Delete All
          </button>
          <button
            onClick={() => setIsSessionModalOpen(true)}
            className="flex items-center px-4 py-2 bg-neon-blue text-white rounded-md hover:bg-blue-700 shadow-neon transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Study Session
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/80 text-red-300 rounded-md border border-red-500">
          {error}
        </div>
      )}

      {studyPlans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">
            No study plans yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyPlans.map((plan) => (
            <div
              key={plan.id}
              className="glass-card shadow-neon p-6 hover:shadow-neon-lg transition-shadow border border-neon-blue"
            >
              <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-neon">
                {plan.subject}
              </h3>
              <p className="text-slate-300 mb-4">
                Exam Date: {new Date(plan.exam_date).toLocaleDateString()}
              </p>
              {plan.description && (
                <p className="text-slate-200">{plan.description}</p>
              )}
              <div className="mt-4 text-sm text-slate-400">
                Created: {new Date(plan.created_at).toLocaleDateString()}
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-red-400 hover:text-red-600 flex items-center"
                  title="Delete Study Plan"
                >
                  <Trash2 size={18} />
                  <span className="ml-1">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddStudySessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        subjects={subjects}
        onAdd={(session) => {
          const newSession = { ...session, id: `session-${Date.now()}` };
          // @ts-ignore
          addSession(newSession);
          setIsSessionModalOpen(false);
          fetchStudyPlans();
        }}
      />
    </div>
  );
};

export default Dashboard;
