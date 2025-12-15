interface MistralRequest {
  model: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  temperature: number;
  max_tokens: number;
}

interface MistralResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class MistralTimetableOptimizer {
  private apiKey: string;
  private apiUrl = "https://api.mistral.ai/v1/chat/completions";
  private currentConstraints: any;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async optimizeTimetable(
    classrooms: any[],
    batches: any[],
    subjects: any[],
    faculties: any[],
    specialClasses: any[],
    constraints: any
  ): Promise<any> {
    // Store constraints for use in fallback
    this.currentConstraints = constraints;

    const prompt = this.buildOptimizationPrompt(
      classrooms,
      batches,
      subjects,
      faculties,
      specialClasses,
      constraints
    );

    const request: MistralRequest = {
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: `You are an expert timetable optimization system for ${constraints.programType} programs. Generate optimal timetables that:
          1. Maximize classroom and laboratory utilization
          2. Minimize faculty and student workload conflicts
          3. Achieve required learning outcomes
          4. Handle multi-department and multi-shift scheduling
          5. Provide suggestions for rearrangements when optimal solutions aren't available
          6. STRICTLY follow all scheduling constraints provided by the user
          7. Ensure faculty ONLY teach subjects they are assigned to
          8. Minimize free periods (maximum 1 per day per batch)
          9. Shuffle time slots to avoid same daily patterns
          10. Prevent scheduling conflicts across faculty and infrastructure
          11. Consider ${constraints.programType} specific requirements and standards
          
          Always respond with valid JSON containing the timetable slots and optimization statistics.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 4000,
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.statusText}`);
      }

      const data: MistralResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content in Mistral response");
      }

      // Parse the JSON response from Mistral
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // If JSON parsing fails, create a structured response
        return this.createFallbackTimetable(
          classrooms,
          batches,
          subjects,
          faculties
        );
      }
    } catch (error) {
      console.error("Mistral API error:", error);
      // Return fallback timetable
      return this.createFallbackTimetable(
        classrooms,
        batches,
        subjects,
        faculties
      );
    }
  }

  private buildOptimizationPrompt(
    classrooms: any[],
    batches: any[],
    subjects: any[],
    faculties: any[],
    specialClasses: any[],
    constraints: any
  ): string {
    return `
    Create an optimized timetable following these STRICT constraints:

    CLASSROOMS (${classrooms.length}):
    ${classrooms
      .map((c) => `- ${c.name}: ${c.type}, capacity ${c.capacity}`)
      .join("\n")}

    STUDENT BATCHES (${batches.length}):
    ${batches
      .map(
        (b) =>
          `- ${b.name}: ${b.strength} students, ${b.department}, ${b.shift} shift`
      )
      .join("\n")}

    SUBJECTS (${subjects.length}):
    ${subjects
      .map(
        (s) =>
          `- ${s.name} (${s.code}): ${s.type}, ${s.classesPerWeek} classes/week, ${s.duration}min each`
      )
      .join("\n")}

    FACULTY (${faculties.length}):
    ${faculties
      .map(
        (f) =>
          `- ${f.name}: max ${f.maxClassesPerDay} classes/day, avg ${
            f.avgLeavesPerMonth
          } leaves/month, teaches: ${f.subjects.join(", ")}`
      )
      .join("\n")}

    PROGRAM TYPE: ${constraints.programType}
    BREAKS ENABLED: ${constraints.enableBreaks ? "Yes" : "No"}

    MANDATORY SCHEDULING CONSTRAINTS (MUST BE FOLLOWED EXACTLY):
    - Max classes per day: ${constraints.maxClassesPerDay}
    - Working hours: ${constraints.startTime} to ${constraints.endTime}
    - Class duration: ${constraints.classDuration} minutes
    - Break duration: ${
      constraints.enableBreaks ? constraints.breakDuration : 0
    } minutes between classes
    - Lunch break: ${constraints.lunchBreakStart} to ${
      constraints.lunchBreakEnd
    }
    - Working days: Monday to Friday ONLY
    - Program type: ${
      constraints.programType
    } - follow specific academic standards
    - STRICT RULE: Each faculty can ONLY teach subjects they are assigned to - NO EXCEPTIONS
    - STRICT RULE: No scheduling conflicts - same faculty/classroom cannot be double-booked
    - STRICT RULE: Respect lunch break timing - no classes during lunch
    - STRICT RULE: Classes must fit within working hours ${
      constraints.startTime
    } to ${constraints.endTime}
    - STRICT RULE: Each subject must have exactly ${subjects
      .map((s) => s.classesPerWeek)
      .join("/")} classes per week as specified
    - CRITICAL RULE: NO SUBJECT REPETITION - Each time slot must have a UNIQUE subject for each batch
    - CRITICAL RULE: NO TEACHER REPETITION - Each time slot must have a UNIQUE teacher for each batch
    - CRITICAL RULE: Maximum 1 free period per day per batch (preferably ZERO free periods)
    - CRITICAL RULE: Distribute subjects evenly across days - avoid same subject multiple times per day
    - OPTIMIZATION: Shuffle time slots to create variety and avoid patterns
    - OPTIMIZATION: Balance faculty workload across the week
    - OPTIMIZATION: Minimize gaps in daily schedules by scheduling consecutive classes
    - OPTIMIZATION: Fill all available time slots before creating free periods
    - OPTIMIZATION: Prevent infrastructure conflicts and ensure efficient resource utilization
    - OPTIMIZATION: Consider ${
      constraints.programType
    } program requirements and academic standards

    SPECIAL FIXED CLASSES:
    ${specialClasses
      .map((sc) => `- ${sc.name}: ${sc.day} ${sc.timeSlot}`)
      .join("\n")}

    Generate a JSON response following this EXACT structure and respecting ALL constraints:
    {
      "timetable": [
        {
          "id": "unique_id",
          "day": "Monday",
          "timeSlot": "9:00-10:00",
          "subjectId": "subject_id",
          "facultyId": "faculty_id",
          "classroomId": "classroom_id",
          "batchId": "batch_id",
          "duration": 60
        }
      ],
      "utilizationStats": {
        "classroomUtilization": 85,
        "facultyWorkload": {"faculty1": 20, "faculty2": 18},
        "suggestions": ["Consider rescheduling...", "Add more sessions for..."]
      },
      "conflicts": [],
      "score": 92
    }

    CRITICAL REQUIREMENTS for 100% optimization:
    1. ZERO scheduling conflicts (same time/faculty/classroom)
    2. Faculty ONLY teach their assigned subjects
    3. Respect ALL time constraints (working hours ${constraints.startTime}-${
      constraints.endTime
    }, lunch break ${constraints.lunchBreakStart}-${
      constraints.lunchBreakEnd
    }, class duration ${constraints.classDuration}min)
    4. Each subject gets EXACTLY the required classes per week
    5. Balance faculty workload evenly across days
    6. Maximize classroom utilization within constraints
    7. ENSURE UNIQUE SUBJECTS AND TEACHERS for each time slot per batch
    8. Distribute subjects across different days to avoid repetition
    9. Fill time slots efficiently with NO unnecessary free periods
    10. Create balanced, realistic, implementable timetables
    `;
  }

  private createFallbackTimetable(
    classrooms: any[],
    batches: any[],
    subjects: any[],
    faculties: any[]
  ) {
    // Generate time slots based on actual constraints
    const timeSlots = this.generateTimeSlotsByConstraints(
      this.currentConstraints
    );
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const timetable = [];
    let idCounter = 1;

    // Create a mapping of subjects to their assigned faculties
    const subjectToFaculty = new Map();
    faculties.forEach((faculty) => {
      faculty.subjects.forEach((subjectId) => {
        if (!subjectToFaculty.has(subjectId)) {
          subjectToFaculty.set(subjectId, []);
        }
        subjectToFaculty.get(subjectId).push(faculty.id);
      });
    });

    // Enhanced tracking for better optimization
    const batchDailySchedule = new Map();
    const facultyDailySchedule = new Map();
    const classroomDailySchedule = new Map();
    const batchSubjectProgress = new Map();

    batches.forEach((batch) => {
      batchDailySchedule.set(batch.id, new Map());
      batchSubjectProgress.set(batch.id, new Map());
      days.forEach((day) => {
        batchDailySchedule.get(batch.id).set(day, []);
      });
      // Initialize subject progress tracking
      subjects.forEach((subject) => {
        batchSubjectProgress.get(batch.id).set(subject.id, 0);
      });
    });

    faculties.forEach((faculty) => {
      facultyDailySchedule.set(faculty.id, new Map());
      days.forEach((day) => {
        facultyDailySchedule.get(faculty.id).set(day, new Set());
      });
    });

    classrooms.forEach((classroom) => {
      classroomDailySchedule.set(classroom.id, new Map());
      days.forEach((day) => {
        classroomDailySchedule.get(classroom.id).set(day, new Set());
      });
    });

    // Create a pool of all required classes
    const requiredClasses = [];
    for (const batch of batches) {
      for (const subject of subjects) {
        for (let week = 0; week < subject.classesPerWeek; week++) {
          requiredClasses.push({
            batchId: batch.id,
            subjectId: subject.id,
            duration: subject.duration || this.currentConstraints.classDuration,
          });
        }
      }
    }

    // Shuffle the required classes to avoid patterns
    for (let i = requiredClasses.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [requiredClasses[i], requiredClasses[j]] = [
        requiredClasses[j],
        requiredClasses[i],
      ];
    }

    // Schedule each class optimally
    for (const classInfo of requiredClasses) {
      const availableFaculties =
        subjectToFaculty.get(classInfo.subjectId) || [];
      if (availableFaculties.length === 0) continue;

      let bestSchedule = null;
      let bestScore = -1;

      // Try each day and time slot combination
      for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        const day = days[dayIndex];
        const batchSchedule = batchDailySchedule
          .get(classInfo.batchId)
          .get(day);

        // Skip if day is already full
        if (batchSchedule.length >= this.currentConstraints.maxClassesPerDay)
          continue;

        for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
          const timeSlot = timeSlots[slotIndex];

          // Check if batch is already scheduled at this time
          if (batchSchedule.some((s) => s.timeSlot === timeSlot)) continue;

          // Find available faculty and classroom
          let availableFaculty = null;
          let availableClassroom = null;

          // Check faculty availability
          for (const facultyId of availableFaculties) {
            const facultySchedule = facultyDailySchedule
              .get(facultyId)
              .get(day);
            if (!facultySchedule.has(timeSlot)) {
              availableFaculty = facultyId;
              break;
            }
          }

          if (!availableFaculty) continue;

          // Check classroom availability
          for (const classroom of classrooms) {
            const classroomSchedule = classroomDailySchedule
              .get(classroom.id)
              .get(day);
            if (!classroomSchedule.has(timeSlot)) {
              availableClassroom = classroom.id;
              break;
            }
          }

          if (!availableClassroom) continue;

          // Calculate score for this slot (prefer filling gaps, avoid repetition)
          let score = 0;

          // Prefer slots that minimize gaps
          const adjacentSlots = batchSchedule.filter((s) => {
            const currentSlotIndex = timeSlots.indexOf(timeSlot);
            const existingSlotIndex = timeSlots.indexOf(s.timeSlot);
            return Math.abs(currentSlotIndex - existingSlotIndex) === 1;
          });
          score += adjacentSlots.length * 10;

          // Prefer days with fewer classes to balance workload
          score +=
            (this.currentConstraints.maxClassesPerDay - batchSchedule.length) *
            5;

          // Avoid same subject on same day
          const sameSubjectToday = batchSchedule.filter(
            (s) => s.subjectId === classInfo.subjectId
          );
          score -= sameSubjectToday.length * 20;

          // Prefer earlier time slots to minimize gaps
          score += (timeSlots.length - slotIndex) * 2;

          if (score > bestScore) {
            bestScore = score;
            bestSchedule = {
              day,
              timeSlot,
              facultyId: availableFaculty,
              classroomId: availableClassroom,
            };
          }
        }
      }

      // Schedule the class if we found a good slot
      if (bestSchedule) {
        const newSlot = {
          id: `slot_${idCounter++}`,
          day: bestSchedule.day,
          timeSlot: bestSchedule.timeSlot,
          subjectId: classInfo.subjectId,
          facultyId: bestSchedule.facultyId,
          classroomId: bestSchedule.classroomId,
          batchId: classInfo.batchId,
          duration: classInfo.duration,
        };

        timetable.push(newSlot);

        // Update tracking
        batchDailySchedule
          .get(classInfo.batchId)
          .get(bestSchedule.day)
          .push(newSlot);
        facultyDailySchedule
          .get(bestSchedule.facultyId)
          .get(bestSchedule.day)
          .add(bestSchedule.timeSlot);
        classroomDailySchedule
          .get(bestSchedule.classroomId)
          .get(bestSchedule.day)
          .add(bestSchedule.timeSlot);

        // Update subject progress
        const currentProgress = batchSubjectProgress
          .get(classInfo.batchId)
          .get(classInfo.subjectId);
        batchSubjectProgress
          .get(classInfo.batchId)
          .set(classInfo.subjectId, currentProgress + 1);
      }
    }

    return {
      timetable,
      utilizationStats: {
        classroomUtilization: this.calculateClassroomUtilization(
          timetable,
          classrooms,
          timeSlots.length
        ),
        facultyWorkload: this.calculateFacultyWorkload(timetable, faculties),
        suggestions: this.generateSuggestions(
          timetable,
          classrooms,
          faculties,
          timeSlots.length
        ),
      },
      conflicts: this.detectConflicts(timetable),
      score: this.calculateOptimizationScore(
        timetable,
        classrooms,
        faculties,
        timeSlots.length
      ),
    };
  }

  private calculateClassroomUtilization(
    timetable: any[],
    classrooms: any[],
    totalTimeSlots: number
  ): number {
    const totalPossibleSlots = classrooms.length * totalTimeSlots * 5; // 5 days
    const usedSlots = timetable.length;
    return Math.round((usedSlots / totalPossibleSlots) * 100);
  }

  private calculateFacultyWorkload(
    timetable: any[],
    faculties: any[]
  ): { [facultyId: string]: number } {
    const workload: { [facultyId: string]: number } = {};

    faculties.forEach((faculty) => {
      const facultyClasses = timetable.filter(
        (slot) => slot.facultyId === faculty.id
      );
      const totalHours = facultyClasses.reduce(
        (sum, slot) => sum + slot.duration / 60,
        0
      );
      workload[faculty.id] = Math.round(totalHours);
    });

    return workload;
  }

  private calculateOptimizationScore(
    timetable: any[],
    classrooms: any[],
    faculties: any[],
    totalTimeSlots: number
  ): number {
    let score = 100;

    // Check classroom utilization efficiency
    const utilizationRate = this.calculateClassroomUtilization(
      timetable,
      classrooms,
      totalTimeSlots
    );
    if (utilizationRate < 60) score -= 15;
    else if (utilizationRate < 80) score -= 8;

    // Check faculty workload balance
    const workloads = Object.values(
      this.calculateFacultyWorkload(timetable, faculties)
    );
    if (workloads.length > 1) {
      const avgWorkload =
        workloads.reduce((sum, w) => sum + w, 0) / workloads.length;
      const workloadVariance =
        workloads.reduce((sum, w) => sum + Math.pow(w - avgWorkload, 2), 0) /
        workloads.length;

      if (workloadVariance > 25) score -= 10;
      else if (workloadVariance > 10) score -= 5;
    }

    // Check for excessive free periods
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let totalFreePeriods = 0;

    // Group by batch and day to count free periods
    const batchDaySlots = new Map();
    timetable.forEach((slot) => {
      const key = `${slot.batchId}-${slot.day}`;
      if (!batchDaySlots.has(key)) {
        batchDaySlots.set(key, []);
      }
      batchDaySlots.get(key).push(slot);
    });

    // Count free periods (gaps between classes)
    batchDaySlots.forEach((slots, key) => {
      if (slots.length > 1) {
        const sortedSlots = slots.sort((a, b) =>
          a.timeSlot.localeCompare(b.timeSlot)
        );
        for (let i = 1; i < sortedSlots.length; i++) {
          // Check if there's a gap between consecutive classes
          const prevEnd = this.getSlotEndTime(sortedSlots[i - 1]);
          const currentStart = this.getSlotStartTime(sortedSlots[i]);
          if (
            this.getTimeDifference(prevEnd, currentStart) >
            this.currentConstraints.breakDuration
          ) {
            totalFreePeriods++;
          }
        }
      }
    });

    // Penalize excessive free periods
    const maxAllowedFreePeriods = timetable.length * 0.1; // 10% of total classes
    if (totalFreePeriods > maxAllowedFreePeriods) {
      score -= Math.min(15, (totalFreePeriods - maxAllowedFreePeriods) * 2);
    }

    // Check for conflicts
    const conflicts = this.detectConflicts(timetable);
    score -= conflicts.length * 5; // 5 points per conflict

    return Math.max(Math.round(score), 60); // Minimum score of 60%
  }

  private detectConflicts(timetable: any[]): string[] {
    const conflicts = [];

    // Check for faculty conflicts (same faculty, same time)
    const facultyTimeSlots = new Map();
    timetable.forEach((slot) => {
      const key = `${slot.facultyId}-${slot.day}-${slot.timeSlot}`;
      if (facultyTimeSlots.has(key)) {
        conflicts.push(
          `Faculty conflict: ${slot.facultyId} scheduled at ${slot.day} ${slot.timeSlot}`
        );
      } else {
        facultyTimeSlots.set(key, slot);
      }
    });

    // Check for classroom conflicts (same classroom, same time)
    const classroomTimeSlots = new Map();
    timetable.forEach((slot) => {
      const key = `${slot.classroomId}-${slot.day}-${slot.timeSlot}`;
      if (classroomTimeSlots.has(key)) {
        conflicts.push(
          `Classroom conflict: ${slot.classroomId} scheduled at ${slot.day} ${slot.timeSlot}`
        );
      } else {
        classroomTimeSlots.set(key, slot);
      }
    });

    return conflicts;
  }

  private generateSuggestions(
    timetable: any[],
    classrooms: any[],
    faculties: any[],
    totalTimeSlots: number
  ): string[] {
    const suggestions = [];

    const utilization = this.calculateClassroomUtilization(
      timetable,
      classrooms,
      totalTimeSlots
    );
    if (utilization < 70) {
      suggestions.push(
        "Consider adding more classes or reducing the number of classrooms to improve utilization"
      );
    }

    const workloads = Object.values(
      this.calculateFacultyWorkload(timetable, faculties)
    );
    const avgWorkload =
      workloads.reduce((sum, w) => sum + w, 0) / workloads.length;
    const maxWorkload = Math.max(...workloads);
    const minWorkload = Math.min(...workloads);

    if (maxWorkload - minWorkload > 10) {
      suggestions.push(
        "Consider redistributing classes to balance faculty workload more evenly"
      );
    }

    if (avgWorkload < 15) {
      suggestions.push(
        "Faculty members have light workloads - consider adding more subjects or classes"
      );
    }

    const conflicts = this.detectConflicts(timetable);
    if (conflicts.length > 0) {
      suggestions.push(
        "Resolve scheduling conflicts by adjusting time slots or reassigning resources"
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Timetable is well-optimized with good resource utilization and balanced workload"
      );
    }

    return suggestions;
  }

  private getSlotStartTime(slot: any): string {
    return slot.timeSlot.split("-")[0];
  }

  private getSlotEndTime(slot: any): string {
    return slot.timeSlot.split("-")[1];
  }

  private getTimeDifference(time1: string, time2: string): number {
    const [h1, m1] = time1.split(":").map(Number);
    const [h2, m2] = time2.split(":").map(Number);
    const minutes1 = h1 * 60 + m1;
    const minutes2 = h2 * 60 + m2;
    return Math.abs(minutes2 - minutes1);
  }

  private generateTimeSlotsByConstraints(constraints: any): string[] {
    const slots = [];
    const startHour = parseInt(constraints.startTime.split(":")[0]);
    const startMinute = parseInt(constraints.startTime.split(":")[1]);
    const endHour = parseInt(constraints.endTime.split(":")[0]);
    const endMinute = parseInt(constraints.endTime.split(":")[1]);
    const classDuration = constraints.classDuration;
    const breakDuration = constraints.enableBreaks
      ? constraints.breakDuration
      : 0;
    const lunchStart = constraints.lunchBreakStart;
    const lunchEnd = constraints.lunchBreakEnd;

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const slotStart = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

      // Add class duration
      let endSlotMinute = currentMinute + classDuration;
      let endSlotHour = currentHour;

      if (endSlotMinute >= 60) {
        endSlotHour += Math.floor(endSlotMinute / 60);
        endSlotMinute = endSlotMinute % 60;
      }

      const slotEnd = `${endSlotHour
        .toString()
        .padStart(2, "0")}:${endSlotMinute.toString().padStart(2, "0")}`;

      // Check if this slot conflicts with lunch break
      if (
        !(slotStart >= lunchStart && slotStart < lunchEnd) &&
        !(slotEnd > lunchStart && slotEnd <= lunchEnd) &&
        !(slotStart < lunchStart && slotEnd > lunchEnd)
      ) {
        slots.push(`${slotStart}-${slotEnd}`);
      }

      // Move to next slot with break
      currentMinute = endSlotMinute + breakDuration;
      currentHour = endSlotHour;

      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }

      // Skip lunch break
      const currentTime = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
      if (currentTime >= lunchStart && currentTime < lunchEnd) {
        const lunchEndHour = parseInt(lunchEnd.split(":")[0]);
        const lunchEndMinute = parseInt(lunchEnd.split(":")[1]);
        currentHour = lunchEndHour;
        currentMinute = lunchEndMinute;
      }
    }

    return slots;
  }
}
