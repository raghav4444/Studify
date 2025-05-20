import React, { useState } from "react";
import { BarChart, Calendar, Clock, TrendingUp } from "lucide-react";
import { StudySession } from "../../types/index copy";
import {
  formatTime,
  calculateDailyStats,
  groupBySubject,
} from "../../utils/helpers";
import StudyChart from "../StudyChart";
import SubjectDistribution from "../SubjectDistribution";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

interface AnalyticsViewProps {
  sessions: StudySession[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ sessions }) => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  // Map sessions to include subject and mood for compatibility with helpers
  const mappedSessions = sessions.map((s) => ({
    ...s,
    subject: (s as any).subject || "Unknown",
    mood: (s as any).mood || "focused",
  }));
  const dailyStats = calculateDailyStats(mappedSessions);
  const subjectDistribution = groupBySubject(mappedSessions);

  // Calculate average session duration
  const avgDuration = sessions.length
    ? sessions.reduce((sum, session) => sum + session.duration, 0) /
      sessions.length
    : 0;

  // Calculate most productive day
  const mostProductiveDay = dailyStats.reduce(
    (max, curr) => (curr.totalMinutes > max.totalMinutes ? curr : max),
    dailyStats[0]
  );

  return (
    <div className="relative min-h-screen p-4 sm:p-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f] overflow-x-hidden">
      {/* Animated glowing header */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-2 animate-pulse">
          <BarChart
            size={48}
            className="text-blue-400 drop-shadow-[0_0_16px_rgba(59,130,246,0.7)]"
          />
        </div>
        <h2 className="text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] mb-1 text-center">
          Analytics
        </h2>
        <p className="text-blue-200 text-lg font-medium drop-shadow mb-2 text-center">
          Detailed insights into your study patterns and progress.
        </p>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
        <Card className="glass-card border-2 border-neon-blue shadow-neon group">
          <CardHeader className="flex items-center gap-3">
            <Clock
              size={28}
              className="text-neon-blue group-hover:text-blue-300 drop-shadow-neon transition-colors duration-300"
            />
            <CardTitle className="text-neon-blue font-bold drop-shadow-neon">
              Average Session Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-blue-200">
              {formatTime(avgDuration)}
            </span>
          </CardContent>
        </Card>
        <Card className="glass-card border-2 border-neon-blue shadow-neon group">
          <CardHeader className="flex items-center gap-3">
            <Calendar
              size={28}
              className="text-neon-blue group-hover:text-blue-300 drop-shadow-neon transition-colors duration-300"
            />
            <CardTitle className="text-neon-blue font-bold drop-shadow-neon">
              Most Productive Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold text-blue-200">
              {mostProductiveDay?.date
                ? new Date(mostProductiveDay.date).toLocaleDateString("en-US", {
                    weekday: "long",
                  })
                : "N/A"}
            </span>
          </CardContent>
        </Card>
        <Card className="glass-card border-2 border-neon-blue shadow-neon group">
          <CardHeader className="flex items-center gap-3">
            <BarChart
              size={28}
              className="text-neon-blue group-hover:text-blue-300 drop-shadow-neon transition-colors duration-300"
            />
            <CardTitle className="text-neon-blue font-bold drop-shadow-neon">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-blue-200">
              {sessions.length}
            </span>
          </CardContent>
        </Card>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 max-w-6xl mx-auto">
        <Card className="glass-card border-2 border-neon-blue shadow-neon">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-neon-blue font-bold drop-shadow-neon">
              Study Trends
            </CardTitle>
            <select
              className="text-sm border border-neon-blue rounded-md py-1 px-3 bg-[#1e293b] text-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue"
              value={timeRange}
              onChange={(e) =>
                setTimeRange(e.target.value as "week" | "month" | "year")
              }
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <StudyChart dailyStats={dailyStats.slice(0, 7).reverse()} />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-2 border-neon-blue shadow-neon">
          <CardHeader>
            <CardTitle className="text-neon-blue font-bold drop-shadow-neon">
              Subject Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <SubjectDistribution data={subjectDistribution} />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Mood Analysis */}
      <div className="max-w-6xl mx-auto">
        <Card className="glass-card border-2 border-neon-blue shadow-neon mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] mb-4">
              Mood Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {["focused", "motivated", "neutral", "tired", "distracted"].map(
                (mood) => {
                  const moodSessions = sessions.filter((s) => s.mood === mood);
                  const percentage = sessions.length
                    ? ((moodSessions.length / sessions.length) * 100).toFixed(1)
                    : "0";

                  return (
                    <div
                      key={mood}
                      className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-lg p-4 shadow-neon border border-neon-blue hover:scale-105 transition-all duration-300 flex flex-col items-center group"
                    >
                      <p className="text-lg font-semibold text-white mb-1 drop-shadow">
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </p>
                      <p className="text-2xl font-bold text-blue-200 mb-1 group-hover:text-blue-100 transition-colors duration-300 drop-shadow">
                        {percentage}%
                      </p>
                      <div className="w-full bg-blue-900/40 rounded-full h-2 mt-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-700 group-hover:bg-blue-400"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsView;
