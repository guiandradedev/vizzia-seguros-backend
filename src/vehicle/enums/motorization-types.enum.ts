export enum MotorizationType {
    GASOLINE = 'Gasoline',
    ETHANOL = 'Ethanol',
    DIESEL = 'Diesel',
    ELECTRIC = 'Electric',
    FLEX = 'Flex',
    HYBRID = 'Hybrid',
};

export const MotorizationWeight = {
    'Gasoline': 0.6,
    'Ethanol': 0.4,
    'Diesel': 0.9,
    'Electric': 1,
    'Flex': 0.6,
    'Hybrid': 1.3
}as const;