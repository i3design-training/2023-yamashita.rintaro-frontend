import { Box, Button, MenuItem, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { apiClient } from '../../config/axios';
import { useUpdateTaskMutation } from '../../features/api/taskApiSlice';
import { TaskWithColumnName } from '../../types/TaskWithColumnName';
import { Category } from '../../types/category';
import { Status } from '../../types/status';

type EditableTask = {
  title: string;
  description: string;
  due_date: Dayjs;
  category_id: string;
  status_id: string;
};

export type TaskEditFormProps = {
  initialTask: EditableTask;
  onTaskUpdate: (task: TaskWithColumnName) => void;
  taskId: string;
};

export const TaskEditForm: FC<TaskEditFormProps> = ({
  initialTask,
  onTaskUpdate,
  taskId,
}) => {
  const [taskData, setTaskData] = useState<EditableTask>({
    ...initialTask,
    due_date: dayjs(initialTask.due_date),
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const [categoriesData, statusesData] = await Promise.all([
          apiClient.get<Category[]>('/categories'),
          apiClient.get<Status[]>('/taskstatus'),
        ]);

        setCategories(categoriesData.data);
        setStatuses(statusesData.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('タスク取得失敗: ', error.message);
        }
      }
    };

    void fetchTaskData();
  }, []);

  const [updateTask] = useUpdateTaskMutation();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setTaskData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    try {
      const response = await updateTask({ taskId, taskData });
      if ('data' in response && response.data) {
        console.log(response);
        onTaskUpdate(response.data);
      } else if ('error' in response) {
        console.error(response.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`タスク編集失敗: ${error.message}`);
      }
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setTaskData((prevState) => ({
        ...prevState,
        due_date: date,
      }));
    }
  };

  const { title, category_id, description, due_date, status_id } = taskData;

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
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
        <DatePicker value={due_date} onChange={handleDateChange} />
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
      <Button type="submit" variant="contained" fullWidth>
        編集する
      </Button>
    </Box>
  );
};
