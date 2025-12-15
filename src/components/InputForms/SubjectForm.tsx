import React, { useState } from "react";
import { Plus, Trash2, Book } from "lucide-react";
import { SubjectData } from "../../types";

interface SubjectFormProps {
  subjects: SubjectData[];
  onChange: (subjects: SubjectData[]) => void;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
  subjects,
  onChange,
}) => {
  const [newSubject, setNewSubject] = useState<Partial<SubjectData>>({
    name: "",
    code: "",
    type: "theory",
    creditHours: 3,
    classesPerWeek: 3,
    duration: 60,
    requiresLab: false,
  });

  const addSubject = () => {
    if (newSubject.name && newSubject.code) {
      const subject: SubjectData = {
        id: `subject_${Date.now()}`,
        name: newSubject.name,
        code: newSubject.code,
        type: newSubject.type || "theory",
        creditHours: newSubject.creditHours || 3,
        classesPerWeek: newSubject.classesPerWeek || 3,
        duration: newSubject.duration || 60,
        requiresLab: newSubject.requiresLab || false,
      };
      onChange([...subjects, subject]);
      setNewSubject({
        name: "",
        code: "",
        type: "theory",
        creditHours: 3,
        classesPerWeek: 3,
        duration: 60,
        requiresLab: false,
      });
    }
  };

  const removeSubject = (id: string) => {
    onChange(subjects.filter((s) => s.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
        <Book className="text-purple-600" size={24} />
        Subjects
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject Name
          </label>
          <input
            type="text"
            value={newSubject.name || ""}
            onChange={(e) =>
              setNewSubject({ ...newSubject, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Subject"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code
          </label>
          <input
            type="text"
            value={newSubject.code || ""}
            onChange={(e) =>
              setNewSubject({ ...newSubject, code: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="201"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={newSubject.type || "theory"}
            onChange={(e) =>
              setNewSubject({
                ...newSubject,
                type: e.target.value as "theory" | "practical" | "laboratory",
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="theory">Theory</option>
            <option value="practical">Practical</option>
            <option value="laboratory">Laboratory</option>
            <option value="elective">Elective</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credits
          </label>
          <input
            type="number"
            value={newSubject.creditHours || ""}
            onChange={(e) =>
              setNewSubject({
                ...newSubject,
                creditHours: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Classes/Week
          </label>
          <input
            type="number"
            value={newSubject.classesPerWeek || ""}
            onChange={(e) =>
              setNewSubject({
                ...newSubject,
                classesPerWeek: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (min)
          </label>
          <input
            type="number"
            value={newSubject.duration || ""}
            onChange={(e) =>
              setNewSubject({
                ...newSubject,
                duration: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="60"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={addSubject}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Subject
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Book className="text-purple-600" size={20} />
              <div>
                <span className="font-medium text-gray-800">
                  {subject.name}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  ({subject.code}, {subject.type}, {subject.classesPerWeek}{" "}
                  classes/week)
                </span>
              </div>
            </div>
            <button
              onClick={() => removeSubject(subject.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {subjects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No subjects added yet. Add your first subject above.
          </div>
        )}
      </div>
    </div>
  );
};
