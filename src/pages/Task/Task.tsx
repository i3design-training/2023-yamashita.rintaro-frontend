import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Button,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { apiClient } from '../../config/axios';
import { useToken } from '../../context/TokenContext';
import TaskCreateForm from '../../component/task/TaskCreateForm';
import { Link } from 'react-router-dom';
import { Dayjs } from 'dayjs';
import SearchInput from '../../component/SearchInput/SearchInput';

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

        {/* Search Bar */}
        <SearchInput handleFilter={handleFilter} />

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
                <Link to={`/tasks/${String(task.id)}`}>詳細</Link>
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
