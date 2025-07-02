// Centralized legal aid contact information
export const legalAidData = {
  // Main national hotline
  nationalHotline: "+255 870 119 363",
  
  // Regional coverage with localized hotlines
  regions: [
    { name: "All Regions", phone: "+255 870 119 363" },
    { name: "Dar es Salaam", phone: "+255 717 111 764" },
    { name: "Mwanza", phone: "+255 769 517 305" },
    { name: "Arusha", phone: "+255 629 296 306" },
    { name: "Dodoma", phone: "+255 754 110 307" },
    { name: "Tanga", phone: "+255 711 032 998" },
    { name: "Morogoro", phone: "+255 800 110 309" },
    { name: "Mbeya", phone: "+255 745 887 221" },
    { name: "Iringa", phone: "+255 762 334 556" }
  ],
  
  // Contact methods
  contactMethods: {
    emergency: {
      phone: "+255 870 119 363",
      description: "24/7 emergency legal assistance"
    },
    email: {
      address: "help@lsf.or.tz",
      description: "Send us your legal questions"
    },
    office: {
      address: "Mikocheni Light Industrial Area, Dar es Salaam",
      hours: "Mon-Fri: 8AM-5PM"
    }
  }
};