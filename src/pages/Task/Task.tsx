import {
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { SearchInput } from '../../component/SearchInput/SearchInput';
import { TaskCreateForm } from '../../component/task/TaskCreateForm';
import { TaskListItem } from '../../component/task/TaskListItem';
import { TitleAndCreateButton } from '../../component/titleAndCreateButton/titleAndCreateButton';
import { useToken } from '../../context/TokenContext';
import { fetchTasks } from '../../features/tasks/tasksSlice';
import { Task } from '../../types/task';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [originalTasks, setOriginalTasks] = useState<Task[]>([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [, , userId] = useToken();
  const [filterVal, setFilterVal] = useState('');
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleNewTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    setOriginalTasks((prevTasks) => [...prevTasks, task]);
    setTaskFormOpen(false);
  };

  useEffect(() => {
    const fetchTasksAsync = async () => {
      const res = await dispatch(fetchTasks(userId));
      setTasks(res.payload as Task[]);
      setOriginalTasks(res.payload as Task[]);
    };
    void fetchTasksAsync();
  }, [dispatch, userId]);

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

  const handleToggleChecked = (value: number) => () => {
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
      <TitleAndCreateButton
        titleText="タスク"
        onButtonClick={() => setTaskFormOpen(true)}
      />
      <Dialog open={taskFormOpen} onClose={() => setTaskFormOpen(false)}>
        <DialogTitle>タスクを作成</DialogTitle>
        <DialogContent>
          <TaskCreateForm
            onTaskCreated={handleNewTask}
            onClose={() => setTaskFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Search Bar */}
      <SearchInput handleFilter={handleFilter} />

      {tasks.length > 0 ? (
        <List sx={{ width: '100%', marginTop: 3 }}>
          {tasks.map((task, index) => (
            <TaskListItem
              key={index}
              task={task}
              index={index}
              checked={checked}
              handleToggleChecked={handleToggleChecked}
            />
          ))}
        </List>
      ) : (
        <Typography variant="h6" component="h3" sx={{ marginTop: 3 }}>
          タスクがありません
        </Typography>
      )}
    </Container>
  );
};

export default Tasks;
