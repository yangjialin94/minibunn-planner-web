export type Task = {
  id: number;
  name: string;
  note: string;
  dueDate: Date;
  isDaily: boolean;
  startDate: Date | null;
  endDate: Date | null;
  isCompleted: boolean;
};
