export type Task = {
  id: number;
  userId: number;
  name: string;
  note: string;
  date: Date;
  isCompleted: boolean;
  // For recurring tasks: implement later
  // repeat: boolean;
  // start: Date | null;
  // end: Date | null;
};

export type TaskCompletion = {
  id: number;
  userId: number;
  date: Task;
  completed: number;
  total: number;
};

export type Journal = {
  id: number;
  userId: number;
  date: Date;
  subject: string;
  entry: string;
};

// For journal images: implement later
// export type JournalImage = {
//   id: number;
//   journalId: number;
//   url: string;
// };
