import { GoogleGenAI, Type } from "@google/genai";
import { PlanRequest, Question, TimetableConstraints } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyPlan = async (request: PlanRequest): Promise<string> => {
  const { topics, daysAvailable, hoursPerDay, focusArea } = request;

  const prompt = `
    You are an expert IIT JEE coaching mentor at a top institute like Bakliwal Tutorials.
    Create a detailed, day-by-day study plan for a student.

    **Constraints:**
    - Topics to cover: ${topics.join(', ')}
    - Total Days: ${daysAvailable}
    - Hours per day: ${hoursPerDay}
    - Primary Focus: ${focusArea}

    **Requirements:**
    - Break down the schedule day by day.
    - Mention specific sub-topics to focus on.
    - Allocate time for Theory, Problem Solving (Sheet/Module), and Previous Year Questions (PYQs).
    - Include a "Review/Backlog" buffer slot if the schedule allows.
    - Format the output in clean Markdown.
    - Be encouraging but rigorous, consistent with top-tier JEE preparation standards.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Failed to generate plan. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI mentor. Please check your connection or API key.";
  }
};

export const generatePracticeQuestions = async (topicName: string, difficulty: string): Promise<Question[]> => {
  const prompt = `Generate 5 multiple-choice questions for the IIT JEE topic: "${topicName}".
  Difficulty Level: ${difficulty}.
  Include options, the correct answer, and a detailed explanation/solution.
  Make them conceptual and similar to JEE Main/Advanced patterns.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionText: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING },
            },
            required: ['questionText', 'options', 'correctAnswer', 'explanation', 'difficulty']
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as Question[];
  } catch (error) {
    console.error("Gemini Question Gen Error:", error);
    return [];
  }
}

export const generateWeeklyTimetable = async (constraints: TimetableConstraints): Promise<string> => {
  const { coachingDays, coachingTime, schoolDetails, sleepSchedule } = constraints;
  
  const prompt = `
    Create a highly structured Weekly Study Timetable for an IIT JEE aspirant.
    
    **Fixed Constraints:**
    - Coaching Days: ${coachingDays.join(', ') || 'None'}
    - Coaching Timings: ${coachingTime.start} to ${coachingTime.end}
    - School/College: ${schoolDetails.attending ? `${schoolDetails.start} to ${schoolDetails.end} (Mon-Fri)` : 'Dummy School / Homeschooling (Full day available)'}
    - Sleep Cycle: ${sleepSchedule.bed} to ${sleepSchedule.wake}

    **Guidelines:**
    1. Fill the gaps between School, Coaching, and Sleep with high-quality Self-Study blocks.
    2. Prioritize 1.5 to 2-hour deep work sessions.
    3. Ensure balanced coverage of Physics, Chemistry, and Maths throughout the week.
    4. Include short breaks (15-30 mins) for meals and recharge.
    5. Sunday should include time for Mock Tests and Revision.
    6. If coaching is late evening, suggest revision/homework slots next morning.
    
    **Output:**
    Provide a clear Markdown table or structured list for "Monday-Friday", "Coaching Days vs Non-Coaching Days", and "Sunday". 
    Highlight total self-study hours available per day.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Failed to generate timetable.";
  } catch (error) {
    console.error("Gemini Timetable Error:", error);
    return "Error generating timetable.";
  }
};
