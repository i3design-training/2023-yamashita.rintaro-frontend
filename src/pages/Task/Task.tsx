import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Box,
  Button,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import { apiClient } from '../../config/axios';
import { useToken } from '../../context/TokenContext';
import TodoForm from '../../component/todo/TodoForm';
import CategoryCreateForm from '../../component/category/CategoryCreateForm';
import TaskStatusCreateForm from '../../component/taskstatus/TaskStatusCreateForm';

type Task = {
  title: string;
  description: string;
  due_date: string;
  category_id: string;
  status_id: string;
  UserId: string;
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [, , userId] = useToken();
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [taskStatusFormOpen, setTaskStatusFormOpen] = useState(false);

  const handleNewTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    setTaskFormOpen(false);
  };

  useEffect(() => {
    apiClient
      .get<Task[]>('/tasks', { params: { userId } })
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          my: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          TODOリスト
        </Typography>

        {/* タスク作成 */}
        <Button
          variant="contained"
          onClick={() => setTaskFormOpen(true)}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          新規タスク
        </Button>
        <Dialog open={taskFormOpen} onClose={() => setTaskFormOpen(false)}>
          <DialogTitle>新規タスクを作成</DialogTitle>
          <DialogContent>
            <TodoForm onTaskCreated={handleNewTask} />
          </DialogContent>
        </Dialog>

        {/* カテゴリー作成 */}
        <Button
          variant="contained"
          onClick={() => setCategoryFormOpen(true)}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          カテゴリ作成
        </Button>
        <Dialog
          open={categoryFormOpen}
          onClose={() => setCategoryFormOpen(false)}
        >
          <DialogTitle>カテゴリ作成</DialogTitle>
          <DialogContent>
            <CategoryCreateForm
              handleCategoryClose={() => setCategoryFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* タスクステータス作成 */}
        <Button
          variant="contained"
          onClick={() => setTaskStatusFormOpen(true)}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          タスクステータス作成
        </Button>
        <Dialog
          open={taskStatusFormOpen}
          onClose={() => setTaskStatusFormOpen(false)}
        >
          <DialogTitle>タスクステータス作成</DialogTitle>
          <DialogContent>
            <TaskStatusCreateForm
              handleTaskStatusClose={() => setTaskStatusFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {tasks.length > 0 ? (
          <List sx={{ width: '100%', marginTop: 3 }}>
            {tasks.map((task, index) => (
              <ListItem key={index} dense button>
                <Checkbox
                  edge="start"
                  checked={checked.includes(index)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': `checkbox-list-label-${index}`,
                  }}
                  onClick={handleToggle(index)}
                />
                <ListItemText
                  id={`checkbox-list-label-${index}`}
                  primary={task.title}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="h6" component="h3" sx={{ marginTop: 3 }}>
            タスクがありません
          </Typography>
        )}
      </Box>
    </Container>
  );
}
