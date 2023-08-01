import { Dayjs } from 'dayjs';

export type Task = {
  id: string;
  title: string;
  description: string;
  due_date: Dayjs;
  category_id: string;
  status_id: string;
  user_id: string;
};

export type EditableTask = {
  title: string;
  description: string;
  due_date: Dayjs;
  category_id: string;
  status_id: string;
};
