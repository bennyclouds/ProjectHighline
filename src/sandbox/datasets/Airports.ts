import { AddressRecord } from "./AddressRecord";

export interface AirportAddressRecord extends AddressRecord {
  iataCode: string;
}

export const AIRPORT_ADDRESSES: AirportAddressRecord[] = [
  {
    label: "Chicago O'Hare International Airport",
    iataCode: "ORD",
    street1: "10000 W O'Hare Ave",
    city: "Chicago",
    state: "IL",
    postalCode: "60666",
    country: "US",
    latitude: 41.9742,
    longitude: -87.9073,
  },
  {
    label: "Chicago Midway International Airport",
    iataCode: "MDW",
    street1: "5700 S Cicero Ave",
    city: "Chicago",
    state: "IL",
    postalCode: "60638",
    country: "US",
    latitude: 41.7868,
    longitude: -87.7522,
  },
];
