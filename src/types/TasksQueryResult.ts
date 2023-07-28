import { Task } from './task';

export type TasksQueryResult = {
  data?: Task[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: unknown;
};
