import React, { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { BatchData } from "../../types";

interface BatchFormProps {
  batches: BatchData[];
  onChange: (batches: BatchData[]) => void;
}

export const BatchForm: React.FC<BatchFormProps> = ({ batches, onChange }) => {
  const [newBatch, setNewBatch] = useState<Partial<BatchData>>({
    name: "",
    strength: 0,
    department: "",
    shift: "morning",
  });

  const addBatch = () => {
    if (newBatch.name && newBatch.strength && newBatch.department) {
      const batch: BatchData = {
        id: `batch_${Date.now()}`,
        name: newBatch.name,
        strength: newBatch.strength,
        department: newBatch.department,
        shift: newBatch.shift || "morning",
      };
      onChange([...batches, batch]);
      setNewBatch({ name: "", strength: 0, department: "", shift: "morning" });
    }
  };

  const removeBatch = (id: string) => {
    onChange(batches.filter((b) => b.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
        <Users className="text-green-600" size={24} />
        Student Batches
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Batch Name
          </label>
          <input
            type="text"
            value={newBatch.name || ""}
            onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Section A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Strength
          </label>
          <input
            type="number"
            value={newBatch.strength || ""}
            onChange={(e) =>
              setNewBatch({
                ...newBatch,
                strength: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <input
            type="text"
            value={newBatch.department || ""}
            onChange={(e) =>
              setNewBatch({ ...newBatch, department: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Department"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shift
          </label>
          <select
            value={newBatch.shift || "morning"}
            onChange={(e) =>
              setNewBatch({
                ...newBatch,
                shift: e.target.value as "morning" | "afternoon" | "evening",
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={addBatch}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Batch
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Users className="text-green-600" size={20} />
              <div>
                <span className="font-medium text-gray-800">{batch.name}</span>
                <span className="text-sm text-gray-600 ml-2">
                  ({batch.strength} students, {batch.department}, {batch.shift})
                </span>
              </div>
            </div>
            <button
              onClick={() => removeBatch(batch.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {batches.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No batches added yet. Add your first batch above.
          </div>
        )}
      </div>
    </div>
  );
};
