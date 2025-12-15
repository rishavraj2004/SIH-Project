export interface ClassroomData {
  id: string;
  name: string;
  capacity: number;
  type: "classroom" | "laboratory";
  equipment?: string[];
}

export interface BatchData {
  id: string;
  name: string;
  strength: number;
  department: string;
  shift: "morning" | "afternoon" | "evening";
}

export interface SubjectData {
  id: string;
  name: string;
  code: string;
  type: "theory" | "practical" | "laboratory" | "elective";
  creditHours: number;
  classesPerWeek: number;
  duration: number; // in minutes
  requiresLab: boolean;
}

export interface FacultyData {
  id: string;
  name: string;
  department: string;
  subjects: string[]; // subject IDs
  maxClassesPerDay: number;
  avgLeavesPerMonth: number;
  preferredTimeSlots?: string[];
}

export interface SpecialClassData {
  id: string;
  name: string;
  day: string;
  timeSlot: string;
  duration: number;
  classroomId: string;
  batchId: string;
  recurring: boolean;
}

export interface Constraints {
  maxClassesPerDay: number;
  startTime: string;
  endTime: string;
  lunchBreakStart: string;
  lunchBreakEnd: string;
  classDuration: number;
  breakDuration: number;
  programType: "B.Ed." | "M.Ed." | "FYUP" | "ITEP";
  enableBreaks: boolean;
}

export interface TimetableSlot {
  id: string;
  day: string;
  timeSlot: string;
  subjectId: string;
  facultyId: string;
  classroomId: string;
  batchId: string;
  duration: number;
  type: "regular" | "special" | "makeup";
}

export interface OptimizationResult {
  timetable: TimetableSlot[];
  utilizationStats: {
    classroomUtilization: number;
    facultyWorkload: { [facultyId: string]: number };
    suggestions: string[];
  };
  conflicts: string[];
  score: number;
}
