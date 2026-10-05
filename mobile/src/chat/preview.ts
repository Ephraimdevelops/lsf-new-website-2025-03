// Development-only fixtures; these never reach the conversation API.
export function chatPreview(sw: boolean) {
  const service = { id: "preview-service", name: sw ? "Mfano: Kituo cha msaada wa kisheria" : "Sample: Legal support centre", district: sw ? "Wilaya yako" : "Your district", region: sw ? "Mkoa wako" : "Your region", intake: "open" };
  const paralegal = { name: sw ? "Mfano: Msaidizi wa kisheria" : "Sample: Community paralegal", district: sw ? "Wilaya yako" : "Your district" };
  return [
    { id: "preview-user", role: "user" as const, content: sw ? "Nahitaji msaada wa kisheria karibu nami. Nianzie wapi?" : "I need legal support near me. Where should I start?" },
    { id: "preview-answer", role: "assistant" as const, content: (sw
      ? "Tunaweza kuanza kwa kutafuta msaada unaofaa hali yako.\n\n1. Chagua huduma ili kuona taarifa zake.\n2. Andaa maelezo mafupi ya unachohitaji.\n3. Kagua ombi lako kabla ya kulituma.\n\nHivi ndivyo chaguo za msaada zitaonekana:"
      : "We can start by finding support for your situation.\n\n1. Open a service to see its details.\n2. Prepare a short description of what you need.\n3. Review your request before sending it.\n\nThis is how your support options will appear:")
      + "\n::SERVICE_CARD:" + JSON.stringify(service) + "::\n::PARALEGAL_CARD:" + JSON.stringify(paralegal) + "::",
      sources: [{ title: sw ? "Mfano wa chanzo cha mwongozo" : "Sample guidance source", publisher: sw ? "Muonekano wa majaribio" : "Design preview" }],
    },
  ];
}
