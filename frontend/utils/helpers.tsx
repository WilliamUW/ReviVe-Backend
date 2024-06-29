import {InlineDataPart} from "@google/generative-ai";

export const fileToGenerativePart = async (
    file: File
  ): Promise<InlineDataPart> => {
    const base64EncodedDataPromise = new Promise<string | undefined>(
      (resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result?.toString().split(",")[1]);
        reader.readAsDataURL(file);
      }
    );
  
    return {
      inlineData: {
        data: (await base64EncodedDataPromise) || "",
        mimeType: file.type,
      },
    };
  };