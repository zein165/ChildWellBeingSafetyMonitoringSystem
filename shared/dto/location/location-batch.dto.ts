export interface LocationPointDto {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

export interface LocationBatchDto {
  locations: LocationPointDto[];
}
