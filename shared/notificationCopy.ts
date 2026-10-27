import type { Locale } from './plainLanguage';
/** Lock-screen copy must stay neutral: never include names, case topics or message text. */
export function notificationCopy(type: string, locale: Locale, english: {title:string;body:string}) {
 if (locale === 'en') return english;
 const bodies: Record<string,string> = {
  'request.message':'Una ujumbe mpya kwenye Haki Yangu. Fungua programu uusome.',
  'request.submitted':'Ombi lako limepokelewa.',
  'message.received':'Una ujumbe mpya kwenye Haki Yangu. Fungua programu uusome.',
  'appointment.reminder':'Una miadi inayokaribia. Fungua Haki Yangu kuona maelezo.',
  'appointment.created':'Kuna taarifa mpya kuhusu miadi yako.',
  'appointment.changed':'Kuna taarifa mpya kuhusu miadi yako.',
  'assignment.offered':'Kuna ombi jipya la kazi. Fungua Haki Yangu kulisoma.',
 };
 return {title:'Taarifa ya Haki Yangu',body:bodies[type]??'Kuna taarifa mpya kwenye Haki Yangu. Fungua programu uione.'};
}
