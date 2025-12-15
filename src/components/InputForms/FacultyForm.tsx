import React, { useState } from "react";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { FacultyData, SubjectData } from "../../types";

interface FacultyFormProps {
  faculties: FacultyData[];
  subjects: SubjectData[];
  onChange: (faculties: FacultyData[]) => void;
}

export const FacultyForm: React.FC<FacultyFormProps> = ({
  faculties,
  subjects,
  onChange,
}) => {
  const [newFaculty, setNewFaculty] = useState<Partial<FacultyData>>({
    name: "",
    department: "",
    subjects: [],
    maxClassesPerDay: 6,
    avgLeavesPerMonth: 2,
  });

  const addFaculty = () => {
    if (newFaculty.name && newFaculty.department) {
      const faculty: FacultyData = {
        id: `faculty_${Date.now()}`,
        name: newFaculty.name,
        department: newFaculty.department,
        subjects: newFaculty.subjects || [],
        maxClassesPerDay: newFaculty.maxClassesPerDay || 6,
        avgLeavesPerMonth: newFaculty.avgLeavesPerMonth || 2,
        preferredTimeSlots: newFaculty.preferredTimeSlots || [],
      };
      onChange([...faculties, faculty]);
      setNewFaculty({
        name: "",
        department: "",
        subjects: [],
        maxClassesPerDay: 6,
        avgLeavesPerMonth: 2,
      });
    }
  };

  const removeFaculty = (id: string) => {
    onChange(faculties.filter((f) => f.id !== id));
  };

  const handleSubjectSelection = (subjectId: string, checked: boolean) => {
    const currentSubjects = newFaculty.subjects || [];
    if (checked) {
      setNewFaculty({
        ...newFaculty,
        subjects: [...currentSubjects, subjectId],
      });
    } else {
      setNewFaculty({
        ...newFaculty,
        subjects: currentSubjects.filter((id) => id !== subjectId),
      });
    }
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? `${subject.name} (${subject.code})` : subjectId;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
        <GraduationCap className="text-orange-600" size={24} />
        Faculty Members
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faculty Name
            </label>
            <input
              type="text"
              value={newFaculty.name || ""}
              onChange={(e) =>
                setNewFaculty({ ...newFaculty, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Dr. John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <input
              type="text"
              value={newFaculty.department || ""}
              onChange={(e) =>
                setNewFaculty({ ...newFaculty, department: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Department"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Classes/Day
              </label>
              <input
                type="number"
                value={newFaculty.maxClassesPerDay || ""}
                onChange={(e) =>
                  setNewFaculty({
                    ...newFaculty,
                    maxClassesPerDay: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avg Leaves/Month
              </label>
              <input
                type="number"
                value={newFaculty.avgLeavesPerMonth || ""}
                onChange={(e) =>
                  setNewFaculty({
                    ...newFaculty,
                    avgLeavesPerMonth: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="2"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teaching Subjects
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white">
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <label
                  key={subject.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <input
                    type="checkbox"
                    checked={(newFaculty.subjects || []).includes(subject.id)}
                    onChange={(e) =>
                      handleSubjectSelection(subject.id, e.target.checked)
                    }
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">
                    {subject.name} ({subject.code})
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Add subjects first to assign to faculty
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={addFaculty}
          className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add Faculty Member
        </button>
      </div>

      <div className="space-y-3">
        {faculties.map((faculty) => (
          <div
            key={faculty.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="text-orange-600" size={20} />
              <div>
                <span className="font-medium text-gray-800">
                  {faculty.name}
                </span>
                <div className="text-sm text-gray-600">
                  <p>
                    {faculty.department} • Max {faculty.maxClassesPerDay}{" "}
                    classes/day
                  </p>
                  <p>
                    Subjects:{" "}
                    {faculty.subjects
                      .map((id) => getSubjectName(id))
                      .join(", ") || "None assigned"}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => removeFaculty(faculty.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {faculties.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No faculty members added yet. Add your first faculty member above.
          </div>
        )}
      </div>
    </div>
  );
};
