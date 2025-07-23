
import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "../themeConfig";
import { Button } from "./Button";
import { Eclipse, Keyboard, Languages, X, Globe } from "lucide-react";

export const Accesibility = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  const toggleHighContrast = () =>
    setTheme((prev) => {
      const isHighContrast = !prev.isHighContrast;
      return {
        ...prev,
        isHighContrast,
        colors: isHighContrast
          ? {
              ...prev.colors,
              primary: "#FFFFFF",
              background: "#000000",
              text: "#FFFFFF",
            }
          : {
              ...prev.colors,
              primary: "#007BFF",
              background: "#FFFFFF",
              text: "#000000",
            },
      };
    });
  const toggleKeyboardNavigation = () =>
    setTheme((prev) => ({ ...prev, isKeyboardNavigation: !prev.isKeyboardNavigation }));

  const setLanguage = (lang: "he" | "en") =>
    setTheme((prev) => ({ ...prev, lang, direction: lang === "he" ? "rtl" : "ltr" }));

  return (
    <>
      
      <Button
        aria-label="Accesibility Options"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg focus:outline-none focus:ring-2"
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.colors.text,
        }}
      >
        ♿
      </Button>

     {isOpen && (
  <div
    role="dialog"
    ref={dialogRef}
    tabIndex={-1}
    aria-labelledby="a11y-dialog-title"
    className="fixed top-16 right-0 h-auto w-56 bg-white rounded-l-lg p-4 shadow-lg flex flex-col space-y-3 z-50"
    style={{
      fontFamily: theme.lang === "he" ? "Noto Sans Hebrew" : "Inter",
      direction: theme.direction,
      color: theme.colors.text,
     // backgroundColor: theme.colors.background || 'white', 
    }}
  >
    <h2 id="a11y-dialog-title" className="text-lg font-bold mb-3">
      Accesibility Options
    </h2>

   <Button
  className="bg-gray-100 rounded p-2 hover:bg-gray-200 transition flex items-center justify-center"
  onClick={toggleHighContrast}
  title={theme.isHighContrast ? "Disable high contrast" : "Active high contrast"}
  aria-label={theme.isHighContrast ? "Disable high contrast" : "Active high contrast"}
> Hight Contrast
  <Eclipse size={20} />
</Button>


   <Button
  className="bg-gray-100 rounded p-2 hover:bg-gray-200 transition flex items-center justify-center"
  onClick={toggleKeyboardNavigation}
  title={theme.isKeyboardNavigation ? "Disable keyboard navigation" : "Enable keyboard navigation"}
  aria-label={theme.isKeyboardNavigation ? "Disable keyboard navigation" : "Enable keyboard navigation"}
> Keyboard Navigation
  <Keyboard size={20} />
</Button>

   <Button
  className="bg-gray-100 rounded p-2 hover:bg-gray-200 transition flex items-center justify-center"
  onClick={() => setLanguage("he")}
  title="Change to Hebrew"
  aria-label="Change to Hebrew"
> Change to Hebrew 
  <Languages size={20} />
</Button>

    <Button
  className="bg-gray-100 rounded p-2 hover:bg-gray-200 transition flex items-center justify-center"
  onClick={() => setLanguage("en")}
  title="Change to English"
  aria-label="Change to English"
> Change to English 
  <Globe size={20} />
 </Button>

    <Button
  className="bg-red-500 text-white rounded p-2 hover:bg-red-600 transition mt-2 flex items-center justify-center"
  onClick={() => setIsOpen(false)}
  title="Close"
  aria-label="Close"
> Close 
  <X size={20} />
</Button>
  </div> 
)}

    </>
  );
};
