import {
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CardItem } from '../../component/cardItem/CardItem';
import { TaskStatusCreateForm } from '../../component/taskstatus/TaskStatusCreateForm';
import { TitleAndCreateButton } from '../../component/titleAndCreateButton/TitleAndCreateButton';
import { apiClient } from '../../config/axios';
import { Status } from '../../types/status';

const TaskStatuses: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [statusFormOpen, setStatusFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await apiClient<Status[]>('/taskstatus');
        setStatuses(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses().catch((error) => console.error(error));
  }, []);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Container component="main" maxWidth="md">
          <TitleAndCreateButton
            titleText="ステータス"
            onButtonClick={() => setStatusFormOpen(true)}
          />
          <Dialog
            open={statusFormOpen}
            onClose={() => setStatusFormOpen(false)}
          >
            <DialogTitle>ステータス作成</DialogTitle>
            <DialogContent>
              <TaskStatusCreateForm
                handleTaskStatusClose={() => setStatusFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Grid container spacing={3}>
            {statuses.map((status) => (
              <Grid item xs={12} sm={6} md={3} key={status.id}>
                <CardItem name={status.name} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
};

export default TaskStatuses;
