import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../config/axios';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskEditForm from '../../component/task/TaskEditForm';

type Task = {
  title: string;
  description: string;
  due_date: string;
  category_id: string;
  status_id: string;
};

type CategoryResponse = {
  id: string;
  name: string;
};

type StatusResponse = {
  id: string;
  name: string;
};

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId?: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null); // New
  const [statusName, setStatusName] = useState<string | null>(null); // New
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onTaskUpdated = (updatedTask: Task) => {
    console.log('Updated task: ', updatedTask);
    setTask(updatedTask);
    handleClose();
  };

  useEffect(() => {
    const fetchTaskAndDetails = async () => {
      try {
        const res = await apiClient.get<Task>(`/tasks/${String(taskId)}`);
        setTask(res.data);

        // category_idをもとにカテゴリー取得
        // 遅い。取得する必要ある？
        const categoryResponse = await apiClient.get<CategoryResponse>(
          `/categories/${res.data.category_id}`,
        );
        setCategoryName(categoryResponse.data.name);

        // 取得する必要ある？
        const statusResponse = await apiClient.get<StatusResponse>(
          `/taskstatus/${res.data.status_id}`,
        );
        setStatusName(statusResponse.data.name);
      } catch (err) {
        console.log('タスクを取得できませんでした', err);
      }
    };
    // useEffectの中で定義した非同期関数を呼び出す際に、
    // その結果を待たないか、エラーハンドリングをしないと、
    // TypeScriptはそのPromiseが解決または拒否されるのを待つことができず、
    // その結果アプリケーションが不安定な状態になる可能性があると警告する
    void fetchTaskAndDetails();
  }, [taskId]);

  return (
    <Box sx={{ p: 2 }}>
      {task && taskId ? (
        <>
          <Typography variant="h4" component="h2">
            Title: {task.title}
            <IconButton
              color="primary"
              aria-label="edit task"
              onClick={handleOpen}
            >
              <EditIcon />
            </IconButton>
            <IconButton color="secondary" aria-label="delete task">
              <DeleteIcon />
            </IconButton>
          </Typography>
          <Typography variant="h6">Description: {task.description}</Typography>
          <Typography variant="body1">
            Due date: {new Date(task.due_date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">Category: {categoryName}</Typography>
          <Typography variant="body1">Status: {statusName}</Typography>
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <TaskEditForm
                task={task}
                handleClose={handleClose}
                taskId={taskId}
                onTaskUpdated={onTaskUpdated}
              />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

export default TaskDetail;
