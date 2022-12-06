export interface LocationType {
  lat: number;
  lng: number;
}

export interface UserLocationType {
  user_name: string;
  lat: number;
  lng: number;
}

export let userLocations: Array<UserLocationType> = [];
