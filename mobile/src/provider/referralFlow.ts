export type DestinationDecision = 'accepted' | 'declined' | 'scheduled' | 'service_delivered' | 'returned' | 'closed';
export const destinationActions: Record<string, DestinationDecision[]> = {
 created:['accepted','declined'],destination_notified:['accepted','declined','returned'],
 accepted:['scheduled','service_delivered','closed'],scheduled:['service_delivered','closed'],
 service_delivered:['closed'],declined:['returned','closed'],returned:['closed'],referred_onward:['closed'],escalated:['accepted','returned','closed'],
};
export const referralLabels: Record<string, {en:string;sw:string}> = {
 created:{en:'Needs a reply',sw:'Inahitaji jibu'},destination_notified:{en:'Needs a reply',sw:'Inahitaji jibu'},
 accepted:{en:'Accepted',sw:'Imekubaliwa'},declined:{en:'Declined',sw:'Imekataliwa'},scheduled:{en:'Service planned',sw:'Huduma imepangwa'},
 service_delivered:{en:'Help provided',sw:'Msaada umetolewa'},returned:{en:'Returned to LSF',sw:'Imerudishwa LSF'},closed:{en:'Closed',sw:'Imefungwa'},
 referred_onward:{en:'Sent to another service',sw:'Imetumwa kwa huduma nyingine'},escalated:{en:'Needs follow-up',sw:'Inahitaji ufuatiliaji'},
 awaiting_beneficiary_consent:{en:'Waiting for permission',sw:'Inasubiri ridhaa'},
};
export const decisionLabels: Record<DestinationDecision,{en:string;sw:string}> = {
 accepted:{en:'Accept referral',sw:'Kubali rufaa'},declined:{en:'Decline referral',sw:'Kataa rufaa'},scheduled:{en:'Mark service planned',sw:'Huduma imepangwa'},
 service_delivered:{en:'Mark help provided',sw:'Msaada umetolewa'},returned:{en:'Return to LSF',sw:'Rudisha kwa LSF'},closed:{en:'Close referral',sw:'Funga rufaa'},
};
