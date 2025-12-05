/**
 * GeminiService - Service for interacting with Google Gemini API
 * Uses function calling to parse natural language into structured task data
 */

class GeminiService {
  constructor(apiKey = null) {
    const envKey = apiKey ?? this.getEnvApiKey();
    // console.log(
    //   "Environment API Key loaded:",
    //   envKey ? `YES (length: ${envKey.length})` : "NO"
    // );
    this.apiKey = envKey || "";
    this.baseUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
  }

  // Get API key from Vite (import.meta.env) or CRA (process.env)
  getEnvApiKey() {
    return process.env.REACT_APP_GEMINI_API_KEY;
  }

  /**
   * Parse natural language task input using Gemini
   * @param {string} text - Natural language input from user
   * @param {string} currentListId - Current list ID for context
   * @returns {Promise<{title: string, notes?: string, due?: string}>}
   */
  async parseTaskInput(text, currentListId = null) {
    if (!this.apiKey) {
      throw new Error(
        "Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file."
      );
    }

    try {
      const now = new Date();
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a task parser. Parse the following task request into structured data.

Current date and time: ${now.toISOString()} (${now.toLocaleString('en-US', { timeZone: userTimezone })})
User timezone: ${userTimezone}

User request: "${text}"

Instructions:
- Extract a clear, concise task title
- Extract any additional notes or context
- If a date and/or time is mentioned, convert it to ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
- Pay special attention to time indicators like "at 2pm", "by 3:30", "tomorrow at noon", etc.
- For relative dates like "tomorrow", "next Friday", calculate the actual date based on the current date
- For times without dates, assume today's date
- Return null for 'due' if no date/time is mentioned`,
                },
              ],
            },
          ],
          tools: [
            {
              functionDeclarations: [
                {
                  name: "create_task",
                  description: "Creates a new task with extracted information",
                  parameters: {
                    type: "object",
                    properties: {
                      title: {
                        type: "string",
                        description: "The main task title (concise and clear)",
                      },
                      notes: {
                        type: "string",
                        description:
                          "Additional notes or details about the task",
                      },
                      due: {
                        type: "string",
                        description:
                          "Due date and time in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ). Include time if mentioned by user. Return null if no date/time mentioned.",
                      },
                    },
                    required: ["title"],
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Gemini API error: ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();

      // Extract function call from response
      const functionCall =
        data.candidates?.[0]?.content?.parts?.[0]?.functionCall;

      if (!functionCall || functionCall.name !== "create_task") {
        // Fallback: if no function call, just use the text as title
        console.warn("No function call in Gemini response, using text as-is");
        return { title: text };
      }

      const args = functionCall.args || {};

      return {
        title: args.title || text,
        notes: args.notes || "",
        due: args.due || null,
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  }

  /**
   * Check if API key is configured
   */
  isConfigured() {
    return !!this.apiKey;
  }
}

export default GeminiService;
