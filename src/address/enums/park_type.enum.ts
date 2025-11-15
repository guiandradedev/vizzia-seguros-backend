export enum ParkType {
    STREET = "Street",
    GARAGE = "Garage",
    CONDOMINIUM = "Condominium"
};

export const ParkWeight = {
    "Street" : 0.8,
    "Garage" : 0.5,
    "Condominium" : 0.3
}as const;