import { FC, ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import { apiClient } from '../../config/axios';
import { useToken } from '../../context/TokenContext';

type Task = {
  title: string;
  description: string;
  due_date: string;
  category_id: string;
  status_id: string;
  user_id: string;
};

// TaskWithIDの型定義
type TaskWithID = Task & {
  id: string;
};

type Category = {
  id: string;
  name: string;
};

type Status = {
  id: string;
  name: string;
};

type TodoFormProps = {
  onTaskCreated: (task: TaskWithID) => void;
  onClose: () => void;
};

const initialTaskState: Task = {
  title: '',
  description: '',
  due_date: '2023-07-11 11:24:28', // TODO 日付ピッカーで日時選択
  category_id: '', // カテゴリー一覧を取得し、ドロップダウンに
  status_id: '', // ステータス一覧を取得し、ドロップダウンに
  user_id: '',
};

const TaskCreateForm: FC<TodoFormProps> = ({ onTaskCreated, onClose }) => {
  const [, , userId] = useToken();
  const [formData, setFormData] = useState<Task>(initialTaskState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    // カテゴリー一覧を取得
    apiClient
      .get<Category[]>('/categories')
      .then((response) => {
        console.log(response);
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('カテゴリー取得できませんでした: ', error);
      });

    // ステータス一覧を取得
    apiClient
      .get<Status[]>('/taskstatus')
      .then((response) => {
        setStatuses(response.data);
      })
      .catch((error) => {
        console.error('ステータス取得できませんでした: ', error);
      });
  }, []);

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
      const res = await apiClient.post<TaskWithID>('/tasks/create', {
        ...formData,
        user_id: userId,
      } as Task);
      setFormData(initialTaskState);
      onTaskCreated(res.data);
      onClose();
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

export default TaskCreateForm;
