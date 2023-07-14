import { FC, ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import { apiClient } from '../../config/axios';

type Task = {
  title: string;
  description: string;
  due_date: string;
  category_id: string;
  status_id: string;
};

type Category = {
  id: string;
  name: string;
};

type Status = {
  id: string;
  name: string;
};

// フォームコンポーネントが受け取るプロパティの型を定義
type TaskEditFormProps = {
  task: Task;
  onTaskUpdated: (task: Task) => void; // タスクが更新された後に呼び出す関数
  handleClose: () => void; // フォームが閉じられる時に呼び出す関数
  taskId: string;
};

const TaskEditForm: FC<TaskEditFormProps> = ({
  task,
  onTaskUpdated,
  handleClose,
  taskId,
}) => {
  const [formData, setFormData] = useState<Task>(task);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    // TODO Joinテーブルでcategory.nameとtaskstatus.nameを一緒に返す
    apiClient
      .get<Category[]>('/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('カテゴリー取得できませんでした: ', error);
      });

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

    try {
      const res = await apiClient.put<Task>(`/tasks/${taskId}`, {
        ...formData,
      } as Task);
      onTaskUpdated(res.data);
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Error while updating task: ${err.message}`);
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
        更新
      </Button>
      <Button variant="text" onClick={handleClose} fullWidth>
        キャンセル
      </Button>
    </Box>
  );
};

export default TaskEditForm;
