import { Box, Button, MenuItem, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { apiClient } from '../../config/axios';
import { useAddTaskMutation } from '../../features/api/apiSlice';
import { TaskWithoutID } from '../../types/TaskWithoutID';
import { Category } from '../../types/category';
import { Status } from '../../types/status';
import { Task } from '../../types/task';

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
  const userId = useSelector((state: RootState) => state.users.userId);
  const [formData, setFormData] = useState<TaskWithoutID>(initialTaskState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [addTask, { isLoading, isError, isSuccess }] = useAddTaskMutation();

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

    const newTaskData: TaskWithoutID = {
      ...formData,
      user_id: userId,
    };
    try {
      // ミューテーションの結果を直接取得します
      // この結果はTask型としてcreatedTaskに格納されます
      const taskCreateResponse = await addTask({ taskData: newTaskData });
      onTaskCreated(taskCreateResponse.data as Task);
      setFormData(initialTaskState);
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
