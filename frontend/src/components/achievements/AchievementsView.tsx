import React from "react";
import {
  Trophy,
  Star,
  Target,
  Clock,
  Book,
  Users,
  Zap,
  Award,
} from "lucide-react";
import { User } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

interface AchievementsViewProps {
  user: User;
  totalStudyHours: number;
  totalSessions: number;
}

const AchievementsView: React.FC<AchievementsViewProps> = ({
  user,
  totalStudyHours,
  totalSessions,
}) => {
  const achievements: Achievement[] = [
    {
      id: "study-master",
      title: "Study Master",
      description: "Complete 100 study sessions",
      icon: <Trophy className="text-yellow-500 animate-bounce" />,
      progress: totalSessions,
      maxProgress: 100,
      unlocked: totalSessions >= 100,
    },
    {
      id: "time-warrior",
      title: "Time Warrior",
      description: "Study for 50 hours total",
      icon: <Clock className="text-blue-500 animate-pulse" />,
      progress: Math.floor(totalStudyHours),
      maxProgress: 50,
      unlocked: totalStudyHours >= 50,
    },
    {
      id: "streak-champion",
      title: "Streak Champion",
      description: "Maintain a 7-day study streak",
      icon: <Zap className="text-purple-500 animate-bounce" />,
      progress: user.currentStreak,
      maxProgress: 7,
      unlocked: user.currentStreak >= 7,
    },
    {
      id: "subject-explorer",
      title: "Subject Explorer",
      description: "Study 5 different subjects",
      icon: <Book className="text-green-500 animate-pulse" />,
      progress: 3, // This should be calculated from actual subjects studied
      maxProgress: 5,
      unlocked: false,
    },
  ];

  return (
    <div className="relative min-h-screen p-4 sm:p-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f] overflow-x-hidden">
      {/* Animated glowing header */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-2 animate-pulse">
          <Trophy
            size={48}
            className="text-blue-400 drop-shadow-[0_0_16px_rgba(59,130,246,0.7)]"
          />
        </div>
        <h2 className="text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] mb-1 text-center">
          Achievements
        </h2>
        <p className="text-blue-200 text-lg font-medium drop-shadow mb-2 text-center">
          Track your progress and unlock achievements as you study!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`glass-card border-2 border-neon-blue shadow-neon group ${
              achievement.unlocked ? "border-neon-blue" : "border-gray-700/50"
            }`}
          >
            <CardHeader className="flex items-center gap-3">
              <div
                className={`p-3 rounded-lg ${
                  achievement.unlocked ? "bg-blue-900/50" : "bg-gray-700/50"
                } group-hover:bg-gray-700/70 transition-colors duration-300`}
              >
                {React.cloneElement(achievement.icon as React.ReactElement, {
                  className: `text-neon-blue drop-shadow-neon group-hover:text-blue-300 transition-colors duration-300`,
                })}
              </div>
              <CardTitle className="text-neon-blue font-bold drop-shadow-neon">
                {achievement.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200 mb-2">{achievement.description}</p>
              <div className="flex justify-between text-sm text-blue-300 mb-1">
                <span>Progress</span>
                <span>
                  {achievement.progress} / {achievement.maxProgress}
                </span>
              </div>
              <div className="w-full bg-blue-900/40 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 bg-neon-blue group-hover:bg-blue-400`}
                  style={{
                    width: `${Math.min(
                      (achievement.progress / achievement.maxProgress) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              {achievement.unlocked ? (
                <div className="mt-3 flex items-center text-sm text-neon-blue animate-fadeIn">
                  <Award size={16} className="mr-1" />
                  <span>Unlocked!</span>
                </div>
              ) : (
                <div
                  className="mt-3 flex items-center text-sm text-gray-400"
                  title="Keep going to unlock this achievement!"
                >
                  <Star size={16} className="mr-1" />
                  <span>Locked</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AchievementsView;
