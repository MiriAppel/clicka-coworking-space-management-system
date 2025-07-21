import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem("language") || "he", // שפה לפי שמורה ב-localStorage
    fallbackLng: "en", // שפה ברירת מחדל
    interpolation: {
      escapeValue: false, // לא נדרש Escape
    },
    backend: {
      loadPath:
        "http://localhost:3001/api/translate/locales/{{lng}}/common.json?keys={{keys}}",

      request: async (options: any, url: string, _payload: any, callback: any) => {
        // כאן payload תמיד יהיה undefined כי זו קריאה עם GET
        const urlObj = new URL(url);
        const keysParam = urlObj.searchParams.get("keys") || "";
        const keyStrings = keysParam.split(",");

        console.log("Fetched keys from query param:", keyStrings);

        try {
          const res = await fetch(url);
          const data = await res.json();

          const translations: Record<string, string> = {};
          keyStrings.forEach((key) => {
            translations[key] = data[key] || key;
          });

          callback(null, { data: translations, status: 200 });
        } catch (err) {
          console.error("Fetch error:", err);
          callback(err, { data: {}, status: 500 });
        }
      },
    },
  });

// מאזין לשינוי בשפה
i18n.on("languageChanged", (lng) => {
  console.log("השפה שונתה ל:", lng);
});

// מאזין להצלחה בטעינת התרגומים
i18n.on("loaded", (loaded) => {
  console.log("נטענו תרגומים:", loaded);
});

// מאזין כשיש שגיאה בטעינת התרגומים
i18n.on("failedLoading", (lng, ns, msg) => {
  console.error("נכשל לטעון תרגום:", lng, ns, msg);
});

export default i18n;
