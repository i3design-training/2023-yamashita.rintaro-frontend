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
    // updatedTask: TaskEditFromのパラメータ
    // setTaskに渡しても画面が更新されない
    setTask(updatedTask);
    console.log(updatedTask);
    handleClose();
  };

  // TODO パフォーマンス改善
  // setTaskが２回呼ばれているのおかしい
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
    // useEffectの中で定義した非同期関数を呼び出す際に、
    // その結果を待たないか、エラーハンドリングをしないと、
    // TypeScriptはそのPromiseが解決または拒否されるのを待つことができず、
    // その結果アプリケーションが不安定な状態になる可能性があると警告する
    void fetchTaskAndDetails();
  }, [taskId, task]); // TODO taskを外す。無限ループする

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ p: 2 }}>
        {task && taskId ? (
          <>
            <Typography variant="h4" component="h2">
              Title: {task['title']}
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
            <Typography variant="h6">
              Description: {task.description}
            </Typography>
            <Typography variant="body1">
              Due date: {new Date(task.due_date).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              Category: {task.category_name}
            </Typography>
            <Typography variant="body1">
              Status: {task.taskstatus_name}
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
