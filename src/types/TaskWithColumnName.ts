import { Dayjs } from 'dayjs';

export type TaskWithColumnName = {
  title: string;
  description: string;
  due_date: Dayjs;
  category_id: string;
  status_id: string;
  category_name: string;
  taskstatus_name: string;
};
