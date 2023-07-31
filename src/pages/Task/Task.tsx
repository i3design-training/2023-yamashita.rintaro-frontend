import {
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { SearchInput } from '../../component/SearchInput/SearchInput';
import { TaskCreateForm } from '../../component/task/TaskCreateForm';
import { TaskListItem } from '../../component/task/TaskListItem';
import { TitleAndCreateButton } from '../../component/titleAndCreateButton/TitleAndCreateButton';
import { useGetTasksQuery } from '../../features/api/apiSlice';
import { selectAllTasks } from '../../features/tasks/tasksSlice';
import { TasksQueryResult } from '../../types/TasksQueryResult';
import { Task } from '../../types/task';

const TaskPage = () => {
  const allTasks = useSelector(selectAllTasks);
  const [checkedTaskIds, setCheckedTaskIds] = useState<number[]>([]);
  const userId = useSelector((state: RootState) => state.users.userId);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    // dataはAPIから取得したタスクのデータを含む
    // もしdataがundefinedであれば、fetchedTasksはデフォルトで空の配列
    data: fetchedTasks = [] as Task[],
    isLoading: isLoadingTasks,
    isSuccess: isTasksQuerySuccessful,
    isError: isTasksQueryFailed,
    error,
  }: TasksQueryResult = useGetTasksQuery({ userId });
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>(fetchedTasks);

  const handleNewTaskCreation = (taskData: Task) => {
    setErrorMessage(null);
    try {
      setIsTaskFormOpen(false);
      setDisplayedTasks([...displayedTasks, taskData]);
    } catch (error) {
      setErrorMessage('タスクの作成に失敗しました。');
    }
  };

  useEffect(() => {
    if (filterKeyword === '') {
      setDisplayedTasks(allTasks);
    } else {
      const filteredTasks = allTasks.filter((task) =>
        task.title.toLowerCase().includes(filterKeyword),
      );
      setDisplayedTasks(filteredTasks);
    }
  }, [filterKeyword, allTasks]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterKeyword(e.target.value);
  };

  const handleToggleTaskCheck = (taskId: number) => () => {
    const currentCheckedIndex = checkedTaskIds.indexOf(taskId);
    const newCheckedTaskIds = [...checkedTaskIds];

    if (currentCheckedIndex === -1) {
      newCheckedTaskIds.push(taskId);
    } else {
      newCheckedTaskIds.splice(currentCheckedIndex, 1);
    }

    setCheckedTaskIds(newCheckedTaskIds);
  };

  useEffect(() => {
    if (isTasksQuerySuccessful) {
      setDisplayedTasks(fetchedTasks);
    }
  }, [isTasksQuerySuccessful, fetchedTasks]);

  let content;

  if (isLoadingTasks) {
    content = <CircularProgress />;
  } else if (isTasksQuerySuccessful) {
    console.log(displayedTasks);
    content = (
      <List sx={{ width: '100%', marginTop: 3 }}>
        {displayedTasks.map((task, index) => (
          <TaskListItem
            key={task.id}
            task={task}
            index={index}
            checkedTaskIds={checkedTaskIds}
            handleToggleTaskCheck={handleToggleTaskCheck}
          />
        ))}
      </List>
    );
  } else if (isTasksQueryFailed && error instanceof Error) {
    content = <div>{error.toString()}</div>;
  }

  return (
    <Container component="main" maxWidth="md">
      <TitleAndCreateButton
        titleText="タスク"
        onButtonClick={() => setIsTaskFormOpen(true)}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <Dialog open={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)}>
        <DialogTitle>タスクを作成</DialogTitle>
        <DialogContent>
          <TaskCreateForm
            onTaskCreated={handleNewTaskCreation}
            onClose={() => setIsTaskFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <SearchInput handleFilterChange={handleFilterChange} />

      {content}
    </Container>
  );
};

export default TaskPage;
