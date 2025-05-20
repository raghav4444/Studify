import React from "react";
import { Clock } from "lucide-react";
import { useStudyContext } from "./../context/StudyContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/Card";
import Button from "../ui/Button";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AvailabilityTab: React.FC = () => {
  const { availability, updateAvailability, generatePlan } = useStudyContext();

  const totalHours = availability.reduce(
    (sum, day) => sum + day.availableHours,
    0
  );

  const handleHoursChange = (day: string, hours: number) => {
    updateAvailability(day, hours);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-blue-500/20 shadow-xl backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Daily Availability</CardTitle>
          <CardDescription className="text-blue-200">
            Set how many hours you can study each day. The planner will use this
            information to create your study schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {availability.map((dayAvailability) => {
              const dayIndex = parseInt(dayAvailability.day);
              const dayName = dayNames[dayIndex];
              const isWeekend = dayIndex === 0 || dayIndex === 6;
              return (
                <div
                  key={dayAvailability.day}
                  className={`rounded-lg border p-4 text-center transition-all duration-300 ${
                    isWeekend
                      ? "bg-blue-900/40 border-blue-500/40 text-blue-200"
                      : "bg-gray-800/50 border-blue-500/20 text-white"
                  } hover:border-blue-500/60 hover:shadow-blue-500/20`}
                >
                  <h3
                    className={`font-medium mb-2 ${
                      isWeekend ? "text-blue-400" : "text-blue-200"
                    }`}
                  >
                    {dayName}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Clock
                      size={16}
                      className={isWeekend ? "text-blue-400" : "text-blue-300"}
                    />
                    <span
                      className={`font-medium ${
                        isWeekend ? "text-blue-300" : "text-blue-200"
                      }`}
                    >
                      {dayAvailability.availableHours} hours
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() =>
                        handleHoursChange(
                          dayAvailability.day,
                          Math.max(0, dayAvailability.availableHours - 0.5)
                        )
                      }
                      className="w-8 h-8 rounded-full bg-gray-900/60 border border-blue-500/20 text-blue-300 hover:bg-blue-900/60 hover:text-blue-400 transition-colors shadow"
                      disabled={dayAvailability.availableHours <= 0}
                    >
                      <span className="text-lg">-</span>
                    </button>
                    <div className="text-sm text-blue-200 font-bold">
                      {dayAvailability.availableHours} hrs
                    </div>
                    <button
                      onClick={() =>
                        handleHoursChange(
                          dayAvailability.day,
                          Math.min(12, dayAvailability.availableHours + 0.5)
                        )
                      }
                      className="w-8 h-8 rounded-full bg-gray-900/60 border border-blue-500/20 text-blue-300 hover:bg-blue-900/60 hover:text-blue-400 transition-colors shadow"
                      disabled={dayAvailability.availableHours >= 12}
                    >
                      <span className="text-lg">+</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-800/70 rounded-lg border border-blue-500/20">
            <div>
              <p className="text-blue-200 font-medium">
                Total weekly availability:
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {totalHours} hours
              </p>
            </div>
            <Button
              onClick={generatePlan}
              size="lg"
              className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Generate Study Plan
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-blue-500/20 shadow-xl backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">
            Tips for Effective Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-blue-200">
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mt-1 mr-2"></span>
              <span>
                Be realistic about how many hours you can commit each day.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mt-1 mr-2"></span>
              <span>
                Consider allocating more hours on weekends when you might have
                more free time.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mt-1 mr-2"></span>
              <span>
                Account for other commitments like classes, work, and social
                activities.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mt-1 mr-2"></span>
              <span>
                Leave some buffer time for unexpected events and review
                sessions.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityTab;
