import { FC, ChangeEvent, FormEvent, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { apiClient } from '../../config/axios';
import { useToken } from '../../context/TokenContext';

type Task = {
  title: string;
  description: string;
  due_date: string;
  category_id: string;
  status_id: string;
  UserId: string;
};

type TodoFormProps = {
  onTaskCreated: (task: Task) => void;
};

const initialTaskState: Task = {
  title: '',
  description: '',
  due_date: '2023-07-11 11:24:28', // TODO 日付ピッカーで日時選択
  category_id: '999dfe0f-e7c8-448b-9c19-2c3bd28db4fe', // TODO カテゴリー一覧を取得し、ドロップダウンに
  status_id: '999e02d9-e953-4ff6-bdf1-c3c0f736c84c', // TODO ステータス一覧を取得し、ドロップダウンに
  UserId: '',
};

const TodoForm: FC<TodoFormProps> = ({ onTaskCreated }) => {
  const [, , userId] = useToken();
  const [formData, setFormData] = useState<Task>(initialTaskState);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    console.log(formData);

    try {
      const res = await apiClient.post<Task>('/tasks/create', {
        ...formData,
        user_id: userId,
      });
      setFormData(initialTaskState);
      onTaskCreated(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Error while creating task: ${err.message}`);
      }
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
        name="category_id"
        label="カテゴリーID"
        variant="outlined"
        value={category_id}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        name="description"
        label="詳細"
        variant="outlined"
        value={description}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        name="due_date"
        label="期日"
        variant="outlined"
        value={due_date}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        name="status_id"
        label="ステータスID"
        variant="outlined"
        value={status_id}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" type="submit" fullWidth>
        追加
      </Button>
    </Box>
  );
};

export default TodoForm;
