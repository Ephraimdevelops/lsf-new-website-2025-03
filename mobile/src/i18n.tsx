import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

export type Locale = "sw" | "en";

const copy = {
  sw: {
    home: "Nyumbani",
    cases: "Kesi Zangu",
    getHelp: "Pata Msaada",
    learn: "Jifunze",
    profile: "Wasifu",
    greeting: "Habari",
    helpToday: "Tunawezaje kukusaidia leo?",
    understand: "Elewa hali yangu",
    requestHelp: "Omba msaada wa kisheria",
    findParalegal: "Tafuta msaidizi wa kisheria",
    askSara: "Uliza Haki",
    whatHappened: "Nini kilitokea?",
    ownWords: "Tueleze kwa maneno yako mwenyewe.",
    next: "Endelea",
    back: "Rudi",
    submit: "Tuma ombi",
    signIn: "Ingia",
    signUp: "Fungua akaunti",
    noCases: "Bado huna kesi.",
    startRequest: "Anza ombi la msaada",
  },
  en: {
    home: "Home",
    cases: "My Cases",
    getHelp: "Get Help",
    learn: "Learn",
    profile: "Profile",
    greeting: "Hello",
    helpToday: "How can we help you today?",
    understand: "Understand my situation",
    requestHelp: "Request legal assistance",
    findParalegal: "Find a paralegal",
    askSara: "Ask Haki",
    whatHappened: "What happened?",
    ownWords: "Tell us in your own words.",
    next: "Next",
    back: "Back",
    submit: "Submit request",
    signIn: "Sign in",
    signUp: "Create account",
    noCases: "You do not have a case yet.",
    startRequest: "Start a help request",
  },
} as const;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: keyof typeof copy.en) => string;
  hydrated: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("sw");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("haki-yangu:locale")
      .then((stored) => {
        if (stored === "sw" || stored === "en") setLocaleState(stored);
      })
      .finally(() => setHydrated(true));
  }, []);

  async function setLocale(nextLocale: Locale) {
    setLocaleState(nextLocale);
    await AsyncStorage.setItem("haki-yangu:locale", nextLocale);
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: (key) => copy[locale][key], hydrated }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
