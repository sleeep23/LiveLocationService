export interface LocationType {
  lat: number;
  lng: number;
}

export interface UserLocationType {
  nickname: string;
  location: LocationType[];
}

export let userLocations: Array<UserLocationType> = [];
