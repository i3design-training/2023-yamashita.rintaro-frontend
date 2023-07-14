import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Box,
  Button,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import { apiClient } from '../../config/axios';
import { useToken } from '../../context/TokenContext';
import CategoryCreateForm from '../../component/category/CategoryCreateForm';
import TaskStatusCreateForm from '../../component/taskstatus/TaskStatusCreateForm';
import TaskCreateForm from '../../component/task/TaskCreateForm';
import { Link } from 'react-router-dom';
import { Dayjs } from 'dayjs';

type Task = {
  id: string;
  title: string;
  description: string;
  due_date: Dayjs;
  category_id: string;
  status_id: string;
  user_id: string;
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [originalTasks, setOriginalTasks] = useState<Task[]>([]); // 追加
  const [checked, setChecked] = useState<number[]>([]);
  const [, , userId] = useToken();
  const [filterVal, setFilterVal] = useState('');
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
        setOriginalTasks(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (filterVal === '') {
      setTasks(originalTasks);
    } else {
      const filteredData = tasks.filter((item) =>
        item.title.toLowerCase().includes(filterVal),
      );
      setTasks(filteredData);
    }
  }, [filterVal]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterVal(e.target.value);
  };

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
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          my: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', my: 8, justifyContent: 'space-between' }}>
          <Typography variant="h3">TODOリスト</Typography>

          {/* タスク作成 */}
          <Button
            variant="contained"
            onClick={() => setTaskFormOpen(true)}
            sx={{ marginTop: 2 }}
          >
            新規タスク
          </Button>
          <Dialog open={taskFormOpen} onClose={() => setTaskFormOpen(false)}>
            <DialogTitle>新規タスクを作成</DialogTitle>
            <DialogContent>
              <TaskCreateForm
                onTaskCreated={handleNewTask}
                onClose={() => setTaskFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </Box>
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

        <Container maxWidth="md" sx={{ mt: 10 }}>
          <TextField
            id="search"
            type="search"
            label="Search"
            defaultValue={''}
            onChange={handleFilter}
            InputProps={{
              // TextFiledにアイコンなどの装飾をする
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Container>

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
                  <Link to={`/tasks/${String(task.id)}`}>詳細</Link>
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
