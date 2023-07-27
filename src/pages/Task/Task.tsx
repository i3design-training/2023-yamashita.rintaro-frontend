import {
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { SearchInput } from '../../component/SearchInput/SearchInput';
import { TaskCreateForm } from '../../component/task/TaskCreateForm';
import { TaskListItem } from '../../component/task/TaskListItem';
import { TitleAndCreateButton } from '../../component/titleAndCreateButton/titleAndCreateButton';
import { useGetTasksQuery } from '../../features/api/apiSlice';
import { fetchTasks, selectAllTasks } from '../../features/tasks/tasksSlice';
import { Task } from '../../types/task';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const originalTasks = useSelector(selectAllTasks);
  const [checked, setChecked] = useState<number[]>([]);
  const userId = useSelector((state: RootState) => state.users.userId);
  const [filterVal, setFilterVal] = useState('');
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  type TasksQueryResult = {
    data?: Task[];
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error?: unknown;
  };

  const {
    data: storedTasks = [] as Task[],
    isLoading,
    isSuccess,
    isError,
    error,
  }: TasksQueryResult = useGetTasksQuery({ userId });

  const handleNewTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    setTaskFormOpen(false);
  };

  useEffect(() => {
    const fetchTasksAsync = async () => {
      const res = await dispatch(fetchTasks(userId));
      setTasks(res.payload as Task[]);
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

  let content;

  if (isLoading) {
    content = <CircularProgress />;
  } else if (isSuccess) {
    content = (
      <List sx={{ width: '100%', marginTop: 3 }}>
        {storedTasks.map((task, index) => (
          <TaskListItem
            key={task.id}
            task={task}
            index={index}
            checked={checked}
            handleToggleChecked={handleToggleChecked}
          />
        ))}
      </List>
    );
  } else if (isError && error instanceof Error) {
    content = <div>{error.toString()}</div>;
  }

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

      {content}
    </Container>
  );
};

export default Tasks;
