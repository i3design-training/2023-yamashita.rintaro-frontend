import { DialogActions, TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import { apiClient } from '../../config/axios';

type TaskStatusCreateFormProps = {
  handleTaskStatusClose: () => void;
};

const TaskStatusCreateForm: React.FC<TaskStatusCreateFormProps> = ({
  handleTaskStatusClose,
}) => {
  const [taskStatusName, setTaskStatusName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/taskstatus/create', {
        name: taskStatusName,
      });
      console.log(res);
      setTaskStatusName('');
      handleTaskStatusClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`taskstatus作成エラー: ${err.message}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="タスクステータス名"
        type="text"
        fullWidth
        value={taskStatusName}
        onChange={(e) => setTaskStatusName(e.target.value)}
      />
      <DialogActions>
        <Button onClick={handleTaskStatusClose} color="primary">
          キャンセル
        </Button>
        <Button type="submit" color="primary">
          作成
        </Button>
      </DialogActions>
    </form>
  );
};

export default TaskStatusCreateForm;
