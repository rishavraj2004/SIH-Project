import React, { useState } from "react";
import { Plus, Trash2, Monitor, FlaskConical } from "lucide-react";
import { ClassroomData } from "../../types";

interface ClassroomFormProps {
  classrooms: ClassroomData[];
  onChange: (classrooms: ClassroomData[]) => void;
}

export const ClassroomForm: React.FC<ClassroomFormProps> = ({
  classrooms,
  onChange,
}) => {
  const [newClassroom, setNewClassroom] = useState<Partial<ClassroomData>>({
    name: "",
    capacity: 0,
    type: "classroom",
    equipment: [],
  });

  const addClassroom = () => {
    if (newClassroom.name && newClassroom.capacity) {
      const classroom: ClassroomData = {
        id: `classroom_${Date.now()}`,
        name: newClassroom.name,
        capacity: newClassroom.capacity,
        type: newClassroom.type || "classroom",
        equipment: newClassroom.equipment || [],
      };
      onChange([...classrooms, classroom]);
      setNewClassroom({
        name: "",
        capacity: 0,
        type: "classroom",
        equipment: [],
      });
    }
  };

  const removeClassroom = (id: string) => {
    onChange(classrooms.filter((c) => c.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
        <Monitor className="text-blue-600" size={24} />
        Classrooms & Laboratories
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Name
          </label>
          <input
            type="text"
            value={newClassroom.name || ""}
            onChange={(e) =>
              setNewClassroom({ ...newClassroom, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Room 101"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacity
          </label>
          <input
            type="number"
            value={newClassroom.capacity || ""}
            onChange={(e) =>
              setNewClassroom({
                ...newClassroom,
                capacity: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={newClassroom.type || "classroom"}
            onChange={(e) =>
              setNewClassroom({
                ...newClassroom,
                type: e.target.value as "classroom" | "laboratory",
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="classroom">Classroom</option>
            <option value="laboratory">Laboratory</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={addClassroom}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Room
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {classroom.type === "laboratory" ? (
                <FlaskConical className="text-green-600" size={20} />
              ) : (
                <Monitor className="text-blue-600" size={20} />
              )}
              <div>
                <span className="font-medium text-gray-800">
                  {classroom.name}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  ({classroom.capacity} seats, {classroom.type})
                </span>
              </div>
            </div>
            <button
              onClick={() => removeClassroom(classroom.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {classrooms.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No classrooms added yet. Add your first classroom above.
          </div>
        )}
      </div>
    </div>
  );
};
