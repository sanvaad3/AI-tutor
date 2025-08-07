import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class BaseAgent {
  constructor(name, instructions) {
    this.name = name;
    this.instructions = instructions;
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async respond(query) {
    try {
      const result = await this.model.generateContent(`${this.instructions}\nUser: ${query}`);
      const response = await result.response;
      return response.text();
    } catch (error) {
      return `Agent ${this.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}