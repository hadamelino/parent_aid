import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

async function generatePrompt(moral) {
    const prompt = `Generate a prompt to generate a kid's story about ${moral}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text 
}

async function generateStory(moral) {
    const promptForTheStory = await generatePrompt(moral);

    const finalStoryPrompt = `Generate a short story (2 paragraphs) about below criteria\n\n${promptForTheStory}`;
    
    const result = await model.generateContent(finalStoryPrompt);
    const response = await result.response;
    const text = response.text();
    return text
}

export default generateStory;