import { Dayjs } from 'dayjs';

// uuidはサーバー側で生成されるので、idは送信したくない
export type TaskWithoutID = {
  title: string;
  description: string;
  due_date: Dayjs;
  category_id: string;
  status_id: string;
  user_id: string;
};
