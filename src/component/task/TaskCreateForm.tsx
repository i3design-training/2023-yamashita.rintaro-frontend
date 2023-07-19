import { Box, Button, MenuItem, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { apiClient } from '../../config/axios';
import { useToken } from '../../context/TokenContext';
import { Category } from '../../types/category';
import { Status } from '../../types/status';
import { Task } from '../../types/task';

// uuidはサーバー側で生成されるので、idは送信したくない
type TaskWithoutID = {
  title: string;
  description: string;
  due_date: Dayjs;
  category_id: string;
  status_id: string;
  user_id: string;
};

export type TodoFormProps = {
  // set関数だからvoidでOK
  // 送信はIDを、入れたくない
  // レスポンスにはIDが欲しい
  onTaskCreated: (task: Task) => void;
  onClose: () => void;
};

const initialTaskState: TaskWithoutID = {
  title: '',
  description: '',
  due_date: dayjs(),
  category_id: '', // カテゴリー一覧を取得し、ドロップダウンに
  status_id: '', // ステータス一覧を取得し、ドロップダウンに
  user_id: '',
};

export const TaskCreateForm: FC<TodoFormProps> = ({
  onTaskCreated,
  onClose,
}) => {
  const [, , userId] = useToken();
  const [formData, setFormData] = useState<TaskWithoutID>(initialTaskState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    const fetchCategoriesAndStatuses = async () => {
      try {
        const [categoryResponse, statusResponse] = await Promise.all([
          apiClient.get<Category[]>('/categories'),
          apiClient.get<Status[]>('/taskstatus'),
        ]);

        setCategories(categoryResponse.data);
        setStatuses(statusResponse.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('データ取得できませんでした: ', error.message);
        }
      }
    };

    void fetchCategoriesAndStatuses();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleTaskCreation = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    console.log(formData);

    try {
      const res = await apiClient.post<Task>('/tasks/create', {
        ...formData,
        user_id: userId,
      } as TaskWithoutID); // IDなしで送信
      setFormData(initialTaskState);
      // Task.tsx
      //    onTaskCreated={handleNewTask}
      //    const handleNewTask = (task: Task) => {
      //      setTasks((prevTasks) => [...prevTasks, task]);
      //      setTaskFormOpen(false);
      //    };
      onTaskCreated(res.data);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Error while creating task: ${err.message}`);
      }
    }
  };

  // Date関係
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setFormData((prevState) => ({
        ...prevState,
        due_date: date,
      }));
    }
  };

  const { title, category_id, description, status_id } = formData;

  return (
    <Box
      component="form"
      onSubmit={handleTaskCreation}
      noValidate
      autoComplete="off"
    >
      <TextField
        name="title"
        label="タスクを入力"
        variant="outlined"
        value={title}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        select
        name="category_id"
        label="カテゴリー"
        variant="outlined"
        value={category_id}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="description"
        label="詳細"
        variant="outlined"
        value={description}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            defaultValue={dayjs(Date.now())}
            onChange={handleDateChange}
          />
        </DemoContainer>
      </LocalizationProvider>
      <TextField
        select
        name="status_id"
        label="ステータス"
        variant="outlined"
        value={status_id}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        {statuses.map((status) => (
          <MenuItem key={status.id} value={status.id}>
            {status.name}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" type="submit" fullWidth>
        追加
      </Button>
      <Button variant="text" onClick={onClose} fullWidth>
        キャンセル
      </Button>
    </Box>
  );
};
