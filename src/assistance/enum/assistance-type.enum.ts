export enum AssistanceType {
  ACCIDENT = 'Acidente',
  BREAKDOWN = 'Pane',
  MAINTENANCE = 'Conserto/Manutenção',
}

export enum AssistanceStatus {
  PENDING = 'Pendente',
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Concluído',
  CANCELLED = 'Cancelado',
}

export const AssistanceCosts = {
  [AssistanceType.ACCIDENT]: 0,
  [AssistanceType.BREAKDOWN]: 150.00,
  [AssistanceType.MAINTENANCE]: 300.00,
};