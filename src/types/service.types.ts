
export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  percentageIncrease: number;
  isActive?: boolean;
}

export interface ServiceOptions {
  duoBoosting: ServiceOption;
  expressBoosting: ServiceOption;
  watchStream: ServiceOption;
}
