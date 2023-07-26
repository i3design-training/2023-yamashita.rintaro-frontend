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
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { TaskEditForm } from '../../component/task/TaskEditForm';
import { fetchTaskById } from '../../features/tasks/tasksSlice';

export type TaskWithColumnName = {
  title: string;
  description: string;
  due_date: Dayjs;
  category_id: string;
  status_id: string;
  category_name: string;
  taskstatus_name: string;
};

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId?: string }>();
  const [task, setTask] = useState<TaskWithColumnName | null>(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // 以下の2つtoggleにできそう
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useCallbackは関数をメモ化し、その依存関係が変更されたときにのみ再計算することで、再レンダリングを抑制し、パフォーマンスを向上させる
  const onTaskUpdated = useCallback(
    (updatedTask: TaskWithColumnName) => {
      setTask(updatedTask);
      console.log(updatedTask);
      handleClose();
    },
    [handleClose],
  );

  useEffect(() => {
    const fetchTaskAndDetails = async () => {
      if (!taskId) {
        console.error('Task ID is undefined');
        return;
      }

      try {
        const res = await dispatch(fetchTaskById(taskId));
        setTask(res.payload as TaskWithColumnName);
      } catch (err) {
        console.log('タスクを取得できませんでした', err);
      }
    };
    void fetchTaskAndDetails();
  }, [taskId]);

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
                <IconButton color="primary" onClick={handleOpen}>
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
