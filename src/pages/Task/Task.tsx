import {
  List,
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
import SearchInput from '../../component/SearchInput/SearchInput';
import { Task } from '../../types/task';
import { TaskListItem } from '../../component/task/TaskListItem';
import TitleAndCreateButton from '../../component/titleAndCreateButton/titleAndCreateButton';

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
              handleToggle={handleToggleChecked}
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
}
