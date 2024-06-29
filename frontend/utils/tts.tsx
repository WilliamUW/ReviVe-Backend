// tts.ts
export const speak = (text: string): void => {
    const synth = window.speechSynthesis;
  
    if (!synth) {
      console.error("Text-to-Speech is not supported in this browser.");
      return;
    }
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => console.log("Speech synthesis finished.");
    utterance.onerror = (event) => console.error("Speech synthesis error:", event);
  
    synth.speak(utterance);
  };
  