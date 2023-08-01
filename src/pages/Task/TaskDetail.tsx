import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Chip,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TaskEditForm } from '../../component/task/TaskEditForm';
import { useFetchTaskQuery } from '../../features/api/taskApiSlice';
import { TaskWithColumnName } from '../../types/TaskWithColumnName';

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId?: string }>();
  const [task, setTask] = useState<TaskWithColumnName | null>(null);
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    console.log(open);
    setOpen((prevOpen) => !prevOpen);
  };

  const onTaskUpdated = useCallback(
    (updatedTask: TaskWithColumnName) => {
      setTask(updatedTask);
      toggleOpen();
    },
    [toggleOpen],
  );

  const { data: taskData, error } = useFetchTaskQuery({ taskId });

  useEffect(() => {
    if (taskData) {
      setTask(taskData);
    } else if (error) {
      console.log('タスクを取得できませんでした', error);
    }
  }, [taskData, error]);

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
                {task.title}
              </Typography>
              <Box>
                <IconButton color="primary" onClick={toggleOpen}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary">
                  <DeleteIcon />
                </IconButton>
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
                期日: {dayjs(task.due_date).format('YYYY-MM-DD')}
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
            <Dialog open={open}>
              <DialogContent>
                <TaskEditForm
                  initialTask={task}
                  taskId={taskId}
                  onTaskUpdate={onTaskUpdated}
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
