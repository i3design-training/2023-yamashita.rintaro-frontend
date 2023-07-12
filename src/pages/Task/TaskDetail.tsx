import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../config/axios';
import { Box, Typography } from '@mui/material';

type Task = {
  title: string;
  description: string;
  due_date: string;
  category_id: string;
  status_id: string;
  user_id: string;
};

const TaskDetail = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  console.log(taskId);

  useEffect(() => {
    apiClient
      .get(`/tasks/${String(taskId)}`)
      .then((res) => {
        console.log(res);
        // setTask(res.data);
      })
      .catch((err) => console.log('タスクを取得できませんでした', err));
  }, [taskId]);

  return (
    <Box sx={{ p: 2 }}>
      {task ? (
        <>
          <Typography variant="h4" component="h2" gutterBottom>
            {task.title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {task.description}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Due date: {new Date(task.due_date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Category ID: {task.category_id}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Status ID: {task.status_id}
          </Typography>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

export default TaskDetail;
