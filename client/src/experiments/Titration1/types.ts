export interface Chemical {
  id: string;
  name: string;
  formula: string;
  color: string;
  concentration: string;
  volume: number;
  molecularWeight?: number;
}

export interface Equipment {
  id: string;
  name: string;
  icon: React.ReactElement;
  capacity?: string;
  description?: string;
}

export interface TitrationData {
  trial: number;
  initialReading: number;
  finalReading: number;
  volume: number;
}

export interface ExperimentState {
  currentStep: number;
  isSetupComplete: boolean;
  buretteReading: number;
  endpointReached: boolean;
  titrationData: TitrationData[];
}
