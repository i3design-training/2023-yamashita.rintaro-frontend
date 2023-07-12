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

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId?: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onTaskUpdated = (updatedTask: Task) => {
    setTask(updatedTask);
    handleClose();
  };

  useEffect(() => {
    if (!taskId) {
      console.error('taskIdが見つかりません');
      return;
    }
    apiClient
      .get<Task>(`/tasks/${String(taskId)}`)
      .then((res) => setTask(res.data))
      .catch((err) => console.log('タスクを取得できませんでした', err));
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
          <Typography variant="body1">
            Category ID: {task.category_id}
          </Typography>
          <Typography variant="body1">Status ID: {task.status_id}</Typography>
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
