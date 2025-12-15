import React, { useState } from "react";
import { Calendar, Settings, BookOpen, Zap, Loader2 } from "lucide-react";
import { ClassroomForm } from "./components/InputForms/ClassroomForm";
import { BatchForm } from "./components/InputForms/BatchForm";
import { SubjectForm } from "./components/InputForms/SubjectForm";
import { FacultyForm } from "./components/InputForms/FacultyForm";
import { ConstraintsForm } from "./components/InputForms/ConstraintsForm";
import { TimetableGrid } from "./components/TimetableDisplay/TimetableGrid";
import { OptimizationStats } from "./components/TimetableDisplay/OptimizationStats";
import { MistralTimetableOptimizer } from "./services/mistralApi";
import {
  ClassroomData,
  BatchData,
  SubjectData,
  FacultyData,
  SpecialClassData,
  OptimizationResult,
  Constraints,
} from "./types";

function App() {
  const [activeTab, setActiveTab] = useState<"input" | "timetable">("input");
  const [isGenerating, setIsGenerating] = useState(false);

  // Form data states
  const [classrooms, setClassrooms] = useState<ClassroomData[]>([]);
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [faculties, setFaculties] = useState<FacultyData[]>([]);
  const [specialClasses, setSpecialClasses] = useState<SpecialClassData[]>([]);
  const [constraints, setConstraints] = useState<Constraints>({
    maxClassesPerDay: 6,
    startTime: "09:00",
    endTime: "16:30",
    lunchBreakStart: "13:00",
    lunchBreakEnd: "14:00",
    classDuration: 60,
    breakDuration: 10,
    programType: "B.Ed.",
    enableBreaks: true,
  });

  // Result state
  const [optimizationResult, setOptimizationResult] =
    useState<OptimizationResult | null>(null);

  const generateTimetable = async () => {
    if (
      classrooms.length === 0 ||
      batches.length === 0 ||
      subjects.length === 0 ||
      faculties.length === 0
    ) {
      alert(
        "Please fill in all required sections before generating the timetable."
      );
      return;
    }

    setIsGenerating(true);
    try {
      const optimizer = new MistralTimetableOptimizer(
        "vAmaLU496HDEHUdQk8PBrPwaQ6eYHiSg"
      );
      const result = await optimizer.optimizeTimetable(
        classrooms,
        batches,
        subjects,
        faculties,
        specialClasses,
        constraints
      );

      setOptimizationResult(result);
      setActiveTab("timetable");
    } catch (error) {
      console.error("Error generating timetable:", error);
      alert(
        "Error generating timetable. Please check your API key and try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateTimetable = async () => {
    setIsGenerating(true);
    try {
      const optimizer = new MistralTimetableOptimizer(
        "vAmaLU496HDEHUdQk8PBrPwaQ6eYHiSg"
      );
      const result = await optimizer.optimizeTimetable(
        classrooms,
        batches,
        subjects,
        faculties,
        specialClasses,
        constraints
      );

      setOptimizationResult(result);
    } catch (error) {
      console.error("Error regenerating timetable:", error);
      alert("Error regenerating timetable. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Smart Timetable Optimizer
                </h1>
                <p className="text-sm text-gray-600">
                  AI-Powered Scheduling with Advanced Optimization
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("input")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "input"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Settings className="inline mr-2" size={16} />
                  Input Parameters
                </button>
                <button
                  onClick={() => setActiveTab("timetable")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "timetable"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  disabled={!optimizationResult}
                >
                  <BookOpen className="inline mr-2" size={16} />
                  Generated Timetable
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "input" ? (
          <div className="space-y-8">
            {/* Generate Button */}
            <div className="text-center">
              <div className="flex gap-4 justify-center items-center">
                <button
                  onClick={generateTimetable}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center gap-3"
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <Zap size={24} />
                  )}
                  {isGenerating
                    ? "Generating Optimized Timetable..."
                    : "Generate Optimized Timetable"}
                </button>

                {optimizationResult && (
                  <button
                    onClick={regenerateTimetable}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Calendar size={20} />
                    )}
                    {isGenerating ? "Regenerating..." : "Regenerate Timetable"}
                  </button>
                )}
              </div>

              {optimizationResult && !isGenerating && (
                <p className="text-sm text-gray-600 mt-3">
                  Click "Regenerate Timetable" to create a new optimized
                  schedule with the same parameters
                </p>
              )}
            </div>

            {/* Input Forms */}
            <ConstraintsForm
              constraints={constraints}
              onChange={setConstraints}
            />
            <ClassroomForm classrooms={classrooms} onChange={setClassrooms} />
            <BatchForm batches={batches} onChange={setBatches} />
            <SubjectForm subjects={subjects} onChange={setSubjects} />
            <FacultyForm
              faculties={faculties}
              subjects={subjects}
              onChange={setFaculties}
            />
          </div>
        ) : (
          optimizationResult && (
            <div className="space-y-8">
              <OptimizationStats
                result={optimizationResult}
                faculties={faculties}
              />
              <TimetableGrid
                result={optimizationResult}
                classrooms={classrooms}
                batches={batches}
                subjects={subjects}
                faculties={faculties}
                onRegenerate={regenerateTimetable}
                isGenerating={isGenerating}
                lunchBreakStart={constraints.lunchBreakStart}
                lunchBreakEnd={constraints.lunchBreakEnd}
              />
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Smart Timetable Optimizer - Powered by AI for Maximum Efficiency &
              Zero Conflicts | Supports {constraints.programType}
            </p>
            <p className="text-xs mt-1">
              Features: Multi-department scheduling • Faculty workload
              optimization • Classroom utilization maximization
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
