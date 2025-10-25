import { MotorizationType } from "../enums/motorization-types.enum";

export const MotorizationTypeMap: Record<MotorizationType, number> = {
    [MotorizationType.GASOLINE]: 1,
    [MotorizationType.ETHANOL]: 2,
    [MotorizationType.DIESEL]: 3,
    [MotorizationType.ELECTRIC]: 4,
    [MotorizationType.FLEX]: 5,
    [MotorizationType.HYBRID]: 6,
};

export const MotorizationTypeReverseMap: Record<number, MotorizationType> = {
    1: MotorizationType.GASOLINE,
    2: MotorizationType.ETHANOL,
    3: MotorizationType.DIESEL,
    4: MotorizationType.ELECTRIC,
    5: MotorizationType.FLEX,
    6: MotorizationType.HYBRID,
};