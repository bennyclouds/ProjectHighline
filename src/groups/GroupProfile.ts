// src/groups/GroupProfile.ts

export interface GroupProfile {
  id: string;                 // unique group/org identifier
  name: string;               // organization or group name

  billingContactName?: string;
  billingContactEmail?: string;
  billingContactPhone?: string;

  negotiatedRateCode?: string;   // optional: corporate rate plan
  notes?: string;                // freeform notes for dispatch or billing
}
