export type ReverseGeocodeBody = 
{ 
    lat: string; 
    lng: string; 
};

export interface AddressComponent {
    types: string;
    short_name: string;
    long_name: string;
  }
  
  
  export interface Geometry {
    location: {
      lat: number;
      lng: number;
    };
    location_type?: string;
  }
  
  
  export interface OlaResult {
    formatted_address: string;
    types: string[];
    name?: string;
    geometry: Geometry;
    address_components: AddressComponent[];
    place_id?: string;
    layer?: string[];
  }
  
  export interface LocationData {
    name: string;
    addressLine1: string;
    country: string;
    city: string;
    state: string;
    pinCode: string;
    latitude: number,
    longitude:number
  }