"use client";

import { useState } from "react";
import { GoogleGenerativeAI, InlineDataPart } from "@google/generative-ai";
import { useRouter } from "next/navigation";
import { fileToGenerativePart } from "@/utils/helpers";
import { DeviceInfo } from "@/utils/device";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export default function UnusedElectronic() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const imagePart: InlineDataPart = await fileToGenerativePart(image);

      const result = await model.generateContent([
        "Analyze this image and provide the following information about the electronic device: name, model, quality, and suggested price (one numeric price), description (detailed listing description for the device like color, quality, etc.). Format the response as JSON.",
        imagePart,
      ]);

      console.log(result);

      const response = result?.response?.candidates?.[0].content.parts?.[0];
      const text = response?.text;
      const jsonMatch = text?.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        const jsonString = jsonMatch[1];
        const info = JSON.parse(jsonString);
        info.b3tr_reward = Math.round(info.suggested_price / 7);
        setDeviceInfo(info);
      } else {
        console.error("Failed to extract JSON from response");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDeviceInfo((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const listItem = () => {
    console.log("Listing item:", deviceInfo);
    alert(
      `You have received ${deviceInfo?.b3tr_reward} B3TR tokens for listing your ${deviceInfo?.name}! \n\n Thank you for preventing more devices from going to landfills. 🌍🔋♻️`
    );
    router.push("/buy");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Sell Electronic</h1>
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
        <div className="mb-4 w-full max-w-md">
          <h2 className="text-xl font-bold mb-2">Device Information:</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={deviceInfo.name}
                onChange={handleInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description:
              </label>
              <textarea
                name="description"
                value={deviceInfo.description}
                onChange={handleInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model:
              </label>
              <input
                type="text"
                name="model"
                value={deviceInfo.model}
                onChange={handleInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quality:
              </label>
              <input
                type="text"
                name="quality"
                value={deviceInfo.quality}
                onChange={handleInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Suggested Price ($):
              </label>
              <input
                type="text"
                name="suggested_price"
                value={deviceInfo.suggested_price}
                onChange={handleInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>
      )}
      {deviceInfo && (
        <>
          <label className="block text-xl text-green-600">
            B3TR Listing Reward: {deviceInfo.b3tr_reward}
          </label>
          <button
            onClick={listItem}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            List Item
          </button>
        </>
      )}
    </div>
  );
}
