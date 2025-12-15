import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  OptimizationResult,
  ClassroomData,
  BatchData,
  SubjectData,
  FacultyData,
} from "../types";

export const exportToPDF = (
  result: OptimizationResult,
  classrooms: ClassroomData[],
  batches: BatchData[],
  subjects: SubjectData[],
  faculties: FacultyData[]
) => {
  const pdf = new jsPDF("l", "mm", "a4"); // Landscape orientation
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    ...new Set(result.timetable.map((slot) => slot.timeSlot)),
  ].sort();

  const getEntityName = (entities: any[], id: string) => {
    const entity = entities.find((e) => e.id === id);
    return entity?.name || entity?.code || "Unknown";
  };

  const getSlotInfo = (day: string, timeSlot: string, batchId: string) => {
    return result.timetable.find(
      (slot) =>
        slot.day === day &&
        slot.timeSlot === timeSlot &&
        slot.batchId === batchId
    );
  };

  let yPosition = 20;

  // Title
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Optimized Timetable Schedule", 148, yPosition, { align: "center" });
  yPosition += 15;

  // Statistics
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `Optimization Score: ${result.score}% | Classroom Utilization: ${result.utilizationStats.classroomUtilization}% | Conflicts: ${result.conflicts.length}`,
    148,
    yPosition,
    { align: "center" }
  );
  yPosition += 15;

  batches.forEach((batch, batchIndex) => {
    if (batchIndex > 0) {
      pdf.addPage();
      yPosition = 20;
    }

    // Batch header
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `${batch.name} - ${batch.department} Department (${
        batch.shift.charAt(0).toUpperCase() + batch.shift.slice(1)
      } Shift)`,
      20,
      yPosition
    );
    yPosition += 10;

    // Prepare table data
    const tableData = [];
    const headers = ["Time Slots", ...days];

    timeSlots.forEach((timeSlot) => {
      const row = [timeSlot];
      days.forEach((day) => {
        const slot = getSlotInfo(day, timeSlot, batch.id);
        if (slot) {
          const subjectName = getEntityName(subjects, slot.subjectId);
          const facultyName = getEntityName(faculties, slot.facultyId);
          const classroomName = getEntityName(classrooms, slot.classroomId);
          row.push(`${subjectName}\n${facultyName}\n${classroomName}`);
        } else if (timeSlot.includes("13:00") || timeSlot.includes("13:30")) {
          row.push("LUNCH BREAK");
        } else {
          row.push("Free Period");
        }
      });
      tableData.push(row);
    });

    // Generate table
    autoTable(pdf, {
      head: [headers],
      body: tableData,
      startY: yPosition,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { fillColor: [220, 220, 220], fontStyle: "bold" },
      },
    });
  });

  pdf.save("timetable-schedule.pdf");
};

export const exportToExcel = (
  result: OptimizationResult,
  classrooms: ClassroomData[],
  batches: BatchData[],
  subjects: SubjectData[],
  faculties: FacultyData[]
) => {
  const workbook = XLSX.utils.book_new();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    ...new Set(result.timetable.map((slot) => slot.timeSlot)),
  ].sort();

  const getEntityName = (entities: any[], id: string) => {
    const entity = entities.find((e) => e.id === id);
    return entity?.name || entity?.code || "Unknown";
  };

  const getSlotInfo = (day: string, timeSlot: string, batchId: string) => {
    return result.timetable.find(
      (slot) =>
        slot.day === day &&
        slot.timeSlot === timeSlot &&
        slot.batchId === batchId
    );
  };

  batches.forEach((batch) => {
    const worksheetData = [];

    // Header row
    worksheetData.push(["Time Slots", ...days]);

    // Data rows
    timeSlots.forEach((timeSlot) => {
      const row = [timeSlot];
      days.forEach((day) => {
        const slot = getSlotInfo(day, timeSlot, batch.id);
        if (slot) {
          const subjectName = getEntityName(subjects, slot.subjectId);
          const facultyName = getEntityName(faculties, slot.facultyId);
          const classroomName = getEntityName(classrooms, slot.classroomId);
          row.push(`${subjectName} | ${facultyName} | ${classroomName}`);
        } else if (timeSlot.includes("13:00") || timeSlot.includes("13:30")) {
          row.push("LUNCH BREAK");
        } else {
          row.push("Free Period");
        }
      });
      worksheetData.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, batch.name);
  });

  // Add statistics sheet
  const statsData = [
    ["Optimization Statistics", ""],
    ["Overall Score", `${result.score}%`],
    [
      "Classroom Utilization",
      `${result.utilizationStats.classroomUtilization}%`,
    ],
    ["Total Conflicts", result.conflicts.length],
    ["", ""],
    ["Faculty Workload", ""],
    ...Object.entries(result.utilizationStats.facultyWorkload).map(
      ([facultyId, workload]) => [
        getEntityName(faculties, facultyId),
        `${workload} hours`,
      ]
    ),
    ["", ""],
    ["Suggestions", ""],
    ...result.utilizationStats.suggestions.map((suggestion) => [
      "",
      suggestion,
    ]),
  ];

  const statsWorksheet = XLSX.utils.aoa_to_sheet(statsData);
  XLSX.utils.book_append_sheet(workbook, statsWorksheet, "Statistics");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(data, "timetable-schedule.xlsx");
};
