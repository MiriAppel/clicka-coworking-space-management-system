import { useState } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceCommand = () => {
  const [listening, setListening] = useState(false);

  const handleListen = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "he-IL";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const wakeWord = "מירי";

      
      console.log("הפקודה שהתקבלה:", transcript);
      handleCommand(transcript);
    };

    recognition.start();
  };

  return (
    <button
      onClick={handleListen}
      className={`fixed bottom-8 left-8 flex items-center justify-center w-16 h-16 rounded-full
        ${listening ? "bg-red-500 animate-pulse" : "bg-green-600 hover:bg-green-700"}
        text-white shadow-lg transition-colors duration-300`}
      title={listening ? "מאזין..." : "לחץ כדי לדבר"}
      aria-label="הפעל עוזרת קולית"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 1v11m0 0a3 3 0 0 0 3-3v-5a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm0 0v6m-4 0h8m-8 0a4 4 0 0 0 8 0"
        />
      </svg>
    </button>
  );
};

const handleCommand = (text: string) => {
  const lower = text.toLocaleLowerCase();

  if (lower.includes("לקוח חדש") || lower.includes("הוספת לקוח"))
    window.location.href =
      "http://localhost:3000/leadAndCustomer/customers/new";
  else {
    alert("לא הבנתי את הפקודה... 😕");
  }
};
