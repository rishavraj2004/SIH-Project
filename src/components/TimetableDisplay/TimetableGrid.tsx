import React from "react";
import {
  Clock,
  MapPin,
  User,
  RefreshCw,
  Download,
  FileText,
} from "lucide-react";
import {
  OptimizationResult,
  ClassroomData,
  BatchData,
  SubjectData,
  FacultyData,
} from "../../types";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";

interface TimetableGridProps {
  result: OptimizationResult;
  classrooms: ClassroomData[];
  batches: BatchData[];
  subjects: SubjectData[];
  faculties: FacultyData[];
  onRegenerate: () => void;
  isGenerating: boolean;
  lunchBreakStart: string;
  lunchBreakEnd: string;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  result,
  classrooms,
  batches,
  subjects,
  faculties,
  onRegenerate,
  isGenerating,
  lunchBreakStart,
  lunchBreakEnd,
}) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Extract unique time slots from the timetable data
  const timeSlots = [
    ...new Set(result.timetable.map((slot) => slot.timeSlot)),
  ].sort();

  const getSlotInfo = (day: string, timeSlot: string, batchId: string) => {
    return result.timetable.find(
      (slot) =>
        slot.day === day &&
        slot.timeSlot === timeSlot &&
        slot.batchId === batchId
    );
  };

  const getEntityName = (entities: any[], id: string) => {
    const entity = entities.find((e) => e.id === id);
    return entity?.name || entity?.code || "Unknown";
  };

  const isLunchBreak = (timeSlot: string) => {
    const slotStart = timeSlot.split("-")[0];
    return slotStart >= lunchBreakStart && slotStart < lunchBreakEnd;
  };

  const handleExportPDF = () => {
    exportToPDF(result, classrooms, batches, subjects, faculties);
  };

  const handleExportExcel = () => {
    exportToExcel(result, classrooms, batches, subjects, faculties);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Clock className="text-indigo-600" size={28} />
          Optimized Timetable Schedule
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <strong>Score: {result.score}%</strong>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <strong>
                Utilization: {result.utilizationStats.classroomUtilization}%
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="bg-red-600 text-white px-3 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <FileText size={16} />
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white px-3 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <Download size={16} />
              Excel
            </button>
          </div>

          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
          >
            <RefreshCw
              className={isGenerating ? "animate-spin" : ""}
              size={18}
            />
            {isGenerating ? "Regenerating..." : "Regenerate Timetable"}
          </button>
        </div>
      </div>

      {batches.map((batch) => (
        <div key={batch.id} className="mb-10">
          <h4 className="text-xl font-semibold text-gray-800 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border-l-4 border-indigo-500">
            📚 {batch.name} - {batch.department} Department (
            {batch.shift.charAt(0).toUpperCase() + batch.shift.slice(1)} Shift)
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden border border-gray-300">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                  <th className="border border-gray-400 p-4 text-center font-semibold min-w-32">
                    ⏰ Time Slots
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="border border-gray-400 p-4 text-center font-semibold min-w-48"
                    >
                      📅 {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot, index) => (
                  <tr
                    key={timeSlot}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border border-gray-400 p-4 bg-gray-200 font-bold text-gray-800 text-center">
                      {timeSlot}
                    </td>
                    {days.map((day) => {
                      const slot = getSlotInfo(day, timeSlot, batch.id);
                      const isLunch = isLunchBreak(timeSlot);

                      return (
                        <td
                          key={`${day}-${timeSlot}`}
                          className="border border-gray-400 p-3 min-h-24 align-middle text-center"
                        >
                          {isLunch ? (
                            <div className="p-3 rounded-lg bg-orange-100 border-2 border-orange-300 shadow-sm">
                              <div className="font-bold text-orange-800 text-sm">
                                🍽️ LUNCH BREAK
                              </div>
                            </div>
                          ) : slot ? (
                            <div className="p-3 rounded-lg bg-blue-50 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="font-bold text-gray-800 text-sm mb-2 text-center">
                                📖 {getEntityName(subjects, slot.subjectId)}
                              </div>
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center justify-center gap-1">
                                  <User size={12} />
                                  <span className="font-medium">
                                    {getEntityName(faculties, slot.facultyId)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-center gap-1">
                                  <MapPin size={12} />
                                  <span className="font-medium">
                                    {getEntityName(
                                      classrooms,
                                      slot.classroomId
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-20 flex items-center justify-center text-gray-500 text-sm font-medium bg-gray-100 rounded-lg border border-gray-300">
                              🕐 Free Period
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {result.conflicts.length > 0 && (
        <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">Conflicts Detected:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {result.conflicts.map((conflict, index) => (
              <li key={index}>• {conflict}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
