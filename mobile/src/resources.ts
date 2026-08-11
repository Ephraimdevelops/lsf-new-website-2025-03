import { colors } from "./theme";

export type ResourceCategory = "land" | "employment" | "family" | "safety" | "contracts" | "consumer";

export type LegalResource = {
  id: string;
  category: ResourceCategory;
  icon: keyof typeof import("@expo/vector-icons/Ionicons").default.glyphMap;
  color: string;
  minutes: number;
  title: { sw: string; en: string };
  summary: { sw: string; en: string };
  steps: Array<{ sw: string; en: string }>;
  tips: Array<{ sw: string; en: string }>;
};

export const resources: LegalResource[] = [
  {
    id: "unpaid-salary",
    category: "employment",
    icon: "briefcase-outline",
    color: colors.tealSoft,
    minutes: 5,
    title: { sw: "Nini cha kufanya usipolipwa mshahara", en: "What to do if you are not paid" },
    summary: { sw: "Hatua za awali za kufuatilia mshahara au malipo ya kazi.", en: "First steps for following up unpaid salary or work payments." },
    steps: [
      { sw: "Kusanya ushahidi wa kazi na makubaliano.", en: "Collect evidence of work and agreements." },
      { sw: "Andika tarehe, kiasi unachodai, na mawasiliano uliyofanya.", en: "Write down dates, amount owed, and prior communication." },
      { sw: "Tuma ombi la maandishi kwa mwajiri kama ni salama.", en: "Send a written request to the employer if safe." },
      { sw: "Omba msaada wa kisheria kama hakuna majibu.", en: "Request legal help if there is no response." },
    ],
    tips: [
      { sw: "Hifadhi ujumbe, mkataba, risiti, au majina ya mashahidi.", en: "Keep messages, contract, receipts, or witness names." },
    ],
  },
  {
    id: "land-agreement",
    category: "land",
    icon: "home-outline",
    color: colors.softPink,
    minutes: 6,
    title: { sw: "Kukagua makubaliano ya ardhi", en: "Checking a land agreement" },
    summary: { sw: "Mambo muhimu ya kuangalia kabla ya kusaini au kulipa.", en: "Key things to check before signing or paying." },
    steps: [
      { sw: "Hakikisha majina ya wahusika yameandikwa kikamilifu.", en: "Confirm all parties are named correctly." },
      { sw: "Angalia eneo, ukubwa, mipaka, na vielelezo.", en: "Check location, size, boundaries, and supporting details." },
      { sw: "Hakiki mamlaka ya muuzaji au mpangishaji.", en: "Verify the seller or landlord has authority." },
      { sw: "Usilipe bila risiti au ushahidi wa maandishi.", en: "Do not pay without a receipt or written proof." },
    ],
    tips: [
      { sw: "Piga picha ya hati na weka nakala salama.", en: "Photograph documents and keep a safe copy." },
    ],
  },
  {
    id: "demand-letter",
    category: "contracts",
    icon: "document-text-outline",
    color: colors.peach,
    minutes: 7,
    title: { sw: "Namna ya kuandika barua ya madai", en: "How to write a demand letter" },
    summary: { sw: "Muundo rahisi wa kudai malipo, mali, au hatua fulani.", en: "A simple structure for requesting payment, property, or action." },
    steps: [
      { sw: "Anza na jina lako na mawasiliano salama.", en: "Start with your name and safe contact details." },
      { sw: "Eleza tatizo kwa ufupi na tarehe muhimu.", en: "Explain the issue briefly with important dates." },
      { sw: "Taja unachotaka kifanyike na muda wa kujibu.", en: "State what you want done and a response deadline." },
      { sw: "Hifadhi nakala na ushahidi wa kuituma.", en: "Keep a copy and proof that it was sent." },
    ],
    tips: [
      { sw: "Epuka lugha ya vitisho. Tumia maneno ya heshima na ukweli.", en: "Avoid threats. Use respectful, factual language." },
    ],
  },
  {
    id: "safety-plan",
    category: "safety",
    icon: "shield-outline",
    color: "#FFF0E7",
    minutes: 4,
    title: { sw: "Mpango mfupi wa usalama", en: "Short safety plan" },
    summary: { sw: "Hatua za haraka kama kuna tishio au ukatili.", en: "Immediate steps when there is a threat or violence." },
    steps: [
      { sw: "Nenda sehemu salama kama kuna hatari ya sasa.", en: "Move to a safe place if there is immediate danger." },
      { sw: "Mweleze mtu unayemwamini.", en: "Tell someone you trust." },
      { sw: "Hifadhi nyaraka muhimu na mawasiliano ya dharura.", en: "Keep important documents and emergency contacts." },
      { sw: "Tafuta msaada rasmi wa karibu.", en: "Seek nearby official support." },
    ],
    tips: [
      { sw: "Haki Yangu si huduma ya dharura.", en: "Haki Yangu is not an emergency service." },
    ],
  },
  {
    id: "child-support",
    category: "family",
    icon: "people-outline",
    color: "#E9F2F5",
    minutes: 6,
    title: { sw: "Msaada wa matunzo ya mtoto", en: "Child support help" },
    summary: { sw: "Taarifa na nyaraka zinazoweza kusaidia kufuatilia matunzo.", en: "Information and documents that can help follow up child support." },
    steps: [
      { sw: "Andika mahitaji ya mtoto na gharama za msingi.", en: "List the child's needs and basic costs." },
      { sw: "Kusanya ushahidi wa uhusiano na malipo yaliyopita.", en: "Collect proof of relationship and past payments." },
      { sw: "Jaribu mawasiliano salama kabla ya hatua rasmi.", en: "Try safe communication before formal steps." },
      { sw: "Omba msaada kama hakuna makubaliano.", en: "Request help if there is no agreement." },
    ],
    tips: [
      { sw: "Maslahi ya mtoto ndiyo kipaumbele.", en: "The child's best interests come first." },
    ],
  },
  {
    id: "consumer-complaint",
    category: "consumer",
    icon: "cart-outline",
    color: "#EEE9F6",
    minutes: 5,
    title: { sw: "Malalamiko ya mlaji", en: "Consumer complaint" },
    summary: { sw: "Namna ya kuweka kumbukumbu na kufuatilia bidhaa au huduma mbovu.", en: "How to document and follow up a faulty product or service." },
    steps: [
      { sw: "Hifadhi risiti, picha, na maelezo ya bidhaa au huduma.", en: "Keep receipt, photos, and product or service details." },
      { sw: "Wasiliana na muuzaji kwa maandishi.", en: "Contact the seller in writing." },
      { sw: "Eleza suluhisho unalotaka.", en: "Explain the remedy you want." },
      { sw: "Omba msaada ikiwa tatizo halijatatuliwa.", en: "Request help if the issue is not resolved." },
    ],
    tips: [
      { sw: "Usikubali makubaliano usiyoyaelewa.", en: "Do not accept terms you do not understand." },
    ],
  },
];

export function getResource(id: string) {
  return resources.find((resource) => resource.id === id);
}
