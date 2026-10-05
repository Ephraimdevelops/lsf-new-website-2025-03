// Published office contact, not a verified emergency or 24/7 helpline.
// Source: https://www.lsftz.org/public/bio/9 (LSF headquarters contact).
// Operational hours and regional intake must be confirmed by LSF.
export const legalAidData = {
  nationalHotline: "+255 22 260 1534", // Legacy property name; office number only.
  regions: [{ name: "LSF office contact", phone: "+255 22 260 1534" }],
  contactMethods: {
    officeSupport: { phone: "+255 22 260 1534", description: "LSF office contact; confirm availability" },
    email: { address: "info@lsftz.org", description: "Contact LSF" },
    office: { address: "Chole Road, Masaki, Dar es Salaam", hours: "Confirm hours before visiting" },
  },
};
