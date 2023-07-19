import { FC, ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import { apiClient } from '../../config/axios';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Category } from '../../types/category';
import { Status } from '../../types/status';

type Task = {
  title: string;
  description: string;
  due_date: Dayjs;
  category_id: string;
  status_id: string;
};

type TaskWithCategoryNameStatusName = {
  title: string;
  description: string;
  due_date: Dayjs;
  category_id: string;
  status_id: string;
  category_name: string;
  taskstatus_name: string;
};

type TaskEditFormProps = {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  handleClose: () => void;
  taskId: string;
};

const TaskEditForm: FC<TaskEditFormProps> = ({
  task,
  onTaskUpdated,
  handleClose,
  taskId,
}) => {
  const [formData, setFormData] = useState<Task>({
    ...task,
    due_date: dayjs(task.due_date),
  });
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

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    try {
      const res = await apiClient.put<Task>(`/tasks/${taskId}`, {
        ...formData,
        due_date: formData.due_date,
      } as TaskWithCategoryNameStatusName);
      onTaskUpdated(res.data);
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Error while updating task: ${err.message}`);
      }
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setFormData((prevState) => ({
        ...prevState,
        due_date: date,
      }));
    }
  };

  const { title, category_id, description, due_date, status_id } = formData;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
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
          <DatePicker value={due_date} onChange={handleDateChange} />
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
      <Button type="submit" variant="contained" fullWidth>
        編集する
      </Button>
    </Box>
  );
};

export default TaskEditForm;
