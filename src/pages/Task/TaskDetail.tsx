import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../config/axios';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  Container,
  Divider,
  Tooltip,
  Chip,
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
  category_name: string;
  taskstatus_name: string;
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
    console.log(updatedTask);
    handleClose();
  };

  useEffect(() => {
    const fetchTaskAndDetails = async () => {
      try {
        const res = await apiClient.get<Task>(`/tasks/${String(taskId)}`);
        console.log(res.data);
        setTask(res.data);
      } catch (err) {
        console.log('タスクを取得できませんでした', err);
      }
    };
    void fetchTaskAndDetails();
  }, [taskId, task]);

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ p: 2 }}>
        {task && taskId ? (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: 1,
                borderColor: 'divider',
                pb: 4,
                mt: 8,
              }}
            >
              <Typography variant="h4" component="h2">
                {task['title']}
              </Typography>
              <Box>
                <Tooltip title="Edit Task">
                  <IconButton color="primary" onClick={handleOpen}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Task">
                  <IconButton color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
              }}
            >
              <Typography variant="body1">
                作成日時: {new Date(task.due_date).toLocaleDateString()}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Chip
                  label={`カテゴリー: ${task.category_name}`}
                  variant="outlined"
                  color="primary"
                />
                <Chip
                  label={`ステータス: ${task.taskstatus_name}`}
                  variant="outlined"
                  color="secondary"
                />
              </Box>
            </Box>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {task.description}
            </Typography>
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
    </Container>
  );
};

export default TaskDetail;
