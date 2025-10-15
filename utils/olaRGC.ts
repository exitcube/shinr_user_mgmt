import { Places } from "ola-maps";
import { AddressComponent, OlaResult, LocationData } from "../types/config";
import { BadRequestError, InternalServerError } from "../types/errors";

let placesClient: Places | null = null;

function getPlacesClient(): Places {
  const apiKey = process.env.OLA_APIKEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new BadRequestError(
      "Missing OLA_APIKEY for reverse geocoding",
      "REVERSE_GC_MISSING_API_KEY"
    );
  }
  if (placesClient) return placesClient;
  placesClient = new Places(apiKey);
  return placesClient;
}


function getComponent(components: AddressComponent[], type: string): string {
  const comp = components.find(c => Array.isArray(c.types) && c.types.includes(type));
  return comp ? comp.long_name : "";
}

export async function getAddress(lat: number, lng: number): Promise<LocationData> {
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw new BadRequestError(
      "lat and lng must be valid numbers",
      "REVERSE_GC_INVALID_COORDS"
    );
  }

  try {
    const client = getPlacesClient();
    const result = await client.reverse_geocode(lat, lng);

    const results: OlaResult[] = result.body.results;
    if (!results || results.length === 0) {
      throw new InternalServerError("No results returned from Ola Maps", "REVERSE_GC_EMPTY");
    }
 
    const best = results[0];
    const { address_components = [], formatted_address, name, geometry } = best;

    return {
      name: name || "",
      addressLine1: formatted_address || "",
      country: getComponent(address_components, "country"),
      state: getComponent(address_components, "administrative_area_level_1"),
      city:
        getComponent(address_components, "locality") ||
        getComponent(address_components, "administrative_area_level_2"),
      pinCode: getComponent(address_components, "postal_code"),
      latitude: geometry.location.lat,
      longitude: geometry.location.lng,
    };
  } catch (err: any) {
    throw new InternalServerError(
      `Reverse geocoding failed${err?.message ? ": " + err.message : ""}`,
      "REVERSE_GC_FAILED"
    );
  }
}
