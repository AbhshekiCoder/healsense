import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyD2rUeenkh62O3lsEbwbxJ0Mm8OqESeVOU"; // get from Google AI Studio
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeReport = async (reportText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Analyze this medical report and give health insights show all data in form of graph, visualization, prescri : ${reportText}`;
    const result = await model.generateContent(prompt);
    console.log(result.response.text())
    return result.response.text();
  } catch (error) {
    console.error(error);
    return "Error analyzing report.";
  }
};
