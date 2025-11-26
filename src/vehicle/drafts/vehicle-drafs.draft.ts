import { CreateConductorDto } from "src/conductors/conductor/dto/create-conductor.dto";
import { CreateVehicleDraft, CreateVehicleDto } from "../dto/create-vehicle.dto";

export interface IStep3Data {
  path: string;
  type: string;
}

export class VehicleDrafts {
    step1?: CreateVehicleDraft;
    step2?: CreateConductorDto[];
    step3?: IStep3Data[];
    estimated_price_step4?: number;
}