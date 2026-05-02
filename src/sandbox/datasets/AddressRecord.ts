/**
 * Canonical address model for all synthetic trip generation.
 * All records represent real, physically existing locations
 * in the United States, formatted to USPS standards.
 */

export interface AddressRecord {
  label: string;

  street1: string;
  street2?: string;

  city: string;
  state: string;        // Two-letter USPS code
  postalCode: string;  // 5-digit ZIP
  country: "US";

  latitude?: number;
  longitude?: number;
}
