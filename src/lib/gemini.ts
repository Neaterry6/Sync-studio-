export async function generateContent(prompt: string, systemInstruction?: string) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, systemInstruction }),
    });
    
    if (!response.ok) throw new Error("Failed to call Gemini");
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return null;
  }
}
