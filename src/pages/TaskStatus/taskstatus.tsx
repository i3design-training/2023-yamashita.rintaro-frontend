import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  Grid,
  Typography,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from '@mui/material';
import { apiClient } from '../../config/axios';
import StatusCreateForm from '../../component/taskstatus/TaskStatusCreateForm';

type Status = {
  id: number;
  name: string;
};

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
          <Box sx={{ display: 'flex', my: 8, justifyContent: 'space-between' }}>
            <Typography variant="h3" textAlign={'center'}>
              Status
            </Typography>
            {/* ステータス作成 */}
            <Button
              variant="contained"
              onClick={() => setStatusFormOpen(true)}
              sx={{ marginTop: 2 }}
            >
              ステータス作成
            </Button>
            <Dialog
              open={statusFormOpen}
              onClose={() => setStatusFormOpen(false)}
            >
              <DialogTitle>ステータス作成</DialogTitle>
              <DialogContent>
                <StatusCreateForm
                  handleTaskStatusClose={() => setStatusFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </Box>
          <Grid container spacing={3}>
            {statuses.map((status) => (
              <Grid item xs={12} sm={6} md={3} key={status.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      textAlign={'center'}
                    >
                      {status.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
};

export default TaskStatuses;
