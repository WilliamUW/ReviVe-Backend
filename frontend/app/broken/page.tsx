"use client";

import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { fileToGenerativePart } from "@/utils/helpers";
import { speak } from "@/utils/tts";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export default function BrokenElectronic() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [conversation, setConversation] = useState<
    { user: string; bot: string }[]
  >([]);
  const [question, setQuestion] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction:
          "You are ReviVeBot, an AI assistant designed to help users identify and troubleshoot their electronic devices. Using an image of the device, you will accurately determine the make and model, diagnose common issues, and provide step-by-step guidance for fixing the device. Your goal is to offer clear, concise, and actionable instructions to help users repair their electronics efficiently. You should be friendly, engaging and likeable, use lots of emojis. Keep answers less than 200 characters, as concise as possible like an actual conversation.",
      });
      const imagePart = await fileToGenerativePart(image);

      const result = await model.generateContent([
        "Analyze this image and provide the following information about the electronic device: name, model, and potential repair instructions. Format the response as JSON.",
        imagePart,
      ]);

      const response = result?.response?.candidates?.[0]?.content?.parts?.[0];
      const text = response?.text;
      const jsonMatch = text?.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        const jsonString = jsonMatch[1];
        const info = JSON.parse(jsonString);
        setDeviceInfo(info);
        const botResponse = `Hello! I see you have a ${info.name} (${info.model}). How can I help you fix it today? 🛠️`;
        speak(botResponse);
        setConversation((prev) => [
          ...prev,
          {
            user: "",
            bot: botResponse,
          },
        ]);
      } else {
        console.error("Failed to extract JSON from response");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const askQuestion = async () => {
    if (!question) return;

    try {
      setConversation((prev) => [...prev, { user: question, bot: "" }]);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction:
          "You are ReviVeBot, an AI assistant designed to help users identify and troubleshoot their electronic devices. Using an image of the device, you will accurately determine the make and model, diagnose common issues, and provide step-by-step guidance for fixing the device. Your goal is to offer clear, concise, and actionable instructions to help users repair their electronics efficiently. You should be friendly, engaging and likeable, use lots of emojis. Keep answers less than 200 characters, as concise as possible like an actual conversation.",
      });
      const result = await model.generateContent([
        `Given the device: ${deviceInfo.name} ${deviceInfo.model}, answer the following repair question: ${question}`,
      ]);

      const response = result.response;
      const answer = response.text();
      speak(answer);
      setConversation((prev) => [...prev, { user: "", bot: answer }]);
      setQuestion("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const listItem = () => {
    // Implement listing logic here
    console.log("Listing broken item:", deviceInfo);
    router.push("/unused");
  };

  const startSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        console.log("Speech recognition started");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        console.log("Transcript:", transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
      };

      recognition.start();
    } else {
      console.error("Speech recognition not supported in this browser");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Repair Broken Electronic</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="Uploaded device"
          className="max-w-sm mb-4"
        />
      )}
      <button
        onClick={analyzeImage}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mb-4"
      >
        Analyze Image
      </button>
      {deviceInfo && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Device Information:</h2>
          <p>Name: {deviceInfo.name}</p>
          <p>Model: {deviceInfo.model}</p>
        </div>
      )}
      {conversation.length > 0 && (
        <div className="mb-4 max-w-md">
          <h2 className="text-xl font-bold">Conversation:</h2>
          {conversation.map((entry, index) => (
            <div key={index} className="mb-2">
              {entry.user && (
                <div className="text-blue-600">
                  <strong>You:</strong> {entry.user}
                </div>
              )}
              {entry.bot && (
                <div className="text-green-600">
                  <strong>ReviVeBot:</strong>
                  <ReactMarkdown>{entry.bot}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {deviceInfo && (
        <div className="mb-4">
          <button
            onClick={startSpeechRecognition}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            🎤
          </button>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a repair question"
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={askQuestion}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Ask
          </button>
        </div>
      )}
      {deviceInfo && (
        <button
          onClick={listItem}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          List as Broken
        </button>
      )}
    </div>
  );
}
