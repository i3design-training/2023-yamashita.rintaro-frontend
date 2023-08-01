import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import * as yup from 'yup';
import { apiClient } from '../../config/axios';
import { useUpdateTaskMutation } from '../../features/api/taskApiSlice';
import { TaskWithColumnName } from '../../types/TaskWithColumnName';
import { Category } from '../../types/category';
import { Status } from '../../types/status';
import { EditableTask } from '../../types/task';

// タスクのバリデーションスキーマを定義
const taskValidationSchema = yup.object().shape({
  title: yup.string().required('タスク名は必須です'),
  description: yup.string().required('詳細は必須です'),
  due_date: yup.date().required('期日は必須です'),
  category_id: yup.string().required('カテゴリーは必須です'),
  status_id: yup.string().required('ステータスは必須です'),
});

// TaskEditFormコンポーネントのプロップスを定義
export type TaskEditFormProps = {
  initialTask: EditableTask;
  onTaskUpdate: (task: TaskWithColumnName) => void;
  taskId: string;
};

// TaskEditFormコンポーネントを定義
export const TaskEditForm: FC<TaskEditFormProps> = ({
  initialTask,
  onTaskUpdate,
  taskId,
}) => {
  // 状態変数を定義
  const [editableTask, setEditableTask] = useState<EditableTask>({
    ...initialTask,
    due_date: dayjs(initialTask.due_date),
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // コンポーネントのマウント時にタスクデータを取得
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

  // タスクを更新するためのミューテーションを定義
  const [updateTask] = useUpdateTaskMutation();

  // 入力変更のハンドラを定義
  const updateEditableTask = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setEditableTask((prevState) => ({ ...prevState, [name]: value }));
  };

  // フォーム送信のハンドラを定義
  const handleFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    try {
      await taskValidationSchema.validate(editableTask, { abortEarly: false });
      const response = await updateTask({ taskId, editableTask });
      if ('data' in response && response.data) {
        console.log(response);
        onTaskUpdate(response.data);
      } else if ('error' in response) {
        console.error(response.error);
      }
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        setValidationErrors(error.errors);
      } else if (error instanceof Error) {
        console.error(`タスク編集失敗: ${error.message}`);
      }
    }
  };

  // 日付変更のハンドラを定義
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setEditableTask((prevState) => ({
        ...prevState,
        due_date: date,
      }));
    }
  };

  // 編集可能なタスクを分割代入して、そのプロパティに簡単にアクセスできるようにする
  const { title, category_id, description, due_date, status_id } = editableTask;

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      noValidate
      autoComplete="off"
    >
      {validationErrors?.map((errorMessage, index) => (
        <Typography key={index} color="error" variant="body2">
          {errorMessage}
        </Typography>
      ))}
      <TextField
        name="title"
        label="タスクを入力"
        variant="outlined"
        value={title}
        onChange={updateEditableTask}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        select
        name="category_id"
        label="カテゴリー"
        variant="outlined"
        value={category_id}
        onChange={updateEditableTask}
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
        onChange={updateEditableTask}
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
        onChange={updateEditableTask}
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
