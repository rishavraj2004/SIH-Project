import React from "react";
import { Settings } from "lucide-react";
import { Constraints } from "../../types";

interface ConstraintsFormProps {
  constraints: Constraints;
  onChange: (constraints: Constraints) => void;
}

export const ConstraintsForm: React.FC<ConstraintsFormProps> = ({
  constraints,
  onChange,
}) => {
  const updateConstraint = (
    field: keyof Constraints,
    value: string | number | boolean
  ) => {
    onChange({ ...constraints, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
        <Settings className="text-indigo-600" size={24} />
        Scheduling Constraints
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 border-b pb-2">
            Program Type
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Program
            </label>
            <select
              value={constraints.programType}
              onChange={(e) =>
                updateConstraint(
                  "programType",
                  e.target.value as "B.Ed." | "M.Ed." | "FYUP" | "ITEP"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="B.Ed.">B.Ed. (Bachelor of Education)</option>
              <option value="M.Ed.">M.Ed. (Master of Education)</option>
              <option value="FYUP">
                FYUP (Four Year Undergraduate Programme)
              </option>
              <option value="ITEP">
                ITEP (Integrated Teacher Education Programme)
              </option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={constraints.enableBreaks}
                onChange={(e) =>
                  updateConstraint("enableBreaks", e.target.checked)
                }
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Enable Breaks Between Classes
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 border-b pb-2">
            Daily Limits
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Classes Per Day
            </label>
            <input
              type="number"
              value={constraints.maxClassesPerDay}
              onChange={(e) =>
                updateConstraint(
                  "maxClassesPerDay",
                  parseInt(e.target.value) || 6
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="1"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Duration (minutes)
            </label>
            <input
              type="number"
              value={constraints.classDuration}
              onChange={(e) =>
                updateConstraint(
                  "classDuration",
                  parseInt(e.target.value) || 60
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="30"
              max="120"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 border-b pb-2">
            Working Hours
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={constraints.startTime}
              onChange={(e) => updateConstraint("startTime", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={constraints.endTime}
              onChange={(e) => updateConstraint("endTime", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 border-b pb-2">
            Break Times
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lunch Break Start
            </label>
            <input
              type="time"
              value={constraints.lunchBreakStart}
              onChange={(e) =>
                updateConstraint("lunchBreakStart", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lunch Break End
            </label>
            <input
              type="time"
              value={constraints.lunchBreakEnd}
              onChange={(e) =>
                updateConstraint("lunchBreakEnd", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Break Between Classes (minutes)
            </label>
            <input
              type="number"
              value={constraints.breakDuration}
              onChange={(e) =>
                updateConstraint("breakDuration", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="0"
              max="30"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
