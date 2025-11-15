export enum MaritalStatusType {
    SINGLE = "Single",
    MARRIED = "Married",
    DIVORCED = "Divorced",
    WIDOW = "Widow"
};


export const MaritalStatusWeight = {
    "Single" : 0.7,
    "Married" : 0.5,
    "Divorced" : 0.6,
    "Widow" : 0.6
}as const;