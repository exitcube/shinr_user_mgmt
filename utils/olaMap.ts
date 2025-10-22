import { Places } from "ola-maps";
import { AddressComponent, OlaResult, LocationData } from "../userAddress/type";
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

export async function getAddress(lat: string, lng: string): Promise<LocationData> {
  
  try {
    const client = getPlacesClient();
    const result = await client.reverse_geocode(lat, lng);
    const results: OlaResult[] = result.body.results;
    if (!results || results.length === 0) {
      throw new InternalServerError("No results returned from Ola Maps", "REVERSE_GC_EMPTY");
    }
 
    const expectedLocation = results[0];
    const { address_components = [], formatted_address, name, geometry } = expectedLocation;

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
 
//
export async function autoComplete(query: string, page: number = 1, limit: number = 10): Promise<{ data: LocationData[], total: number, page: number, limit: number }> {
  const client = getPlacesClient();

  const result = await client.autocomplete(query);
  const allPredictions = result.body?.predictions || [];


  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPredictions = allPredictions.slice(startIndex, endIndex);

  const predictions = paginatedPredictions.map((item: any) => {
    const terms = item.terms?.map((t: any) => t.value) || [];

    const name = item.structured_formatting?.main_text || "";
    const addressLine1 = item.description || "";
    const latitude = item.geometry?.location?.lat?.toString() || "";
    const longitude = item.geometry?.location?.lng?.toString() || "";

    const country = terms[terms.length - 1] || "";
    const pinCode = terms[terms.length - 2] || "";
    const state = terms[terms.length - 3] || "";
    const city = terms[terms.length - 4] || "";

    return {
      name,
      addressLine1,
      country,
      city,
      state,
      pinCode,
      latitude,
      longitude,
    };
  });
  const total = allPredictions.length;

  return {
    data: predictions,
    total,
    page,
    limit,
  };
}

