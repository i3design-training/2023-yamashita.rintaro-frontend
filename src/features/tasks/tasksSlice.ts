import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Task } from '../../types/task';

type TaskState = {
  tasks: Task[];
};

type TaskUpdatedPayload = {
  id: string;
  title: string;
  description: string;
};

const initialState: TaskState = { tasks: [] };

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    taskUpdated(state, action: PayloadAction<TaskUpdatedPayload>) {
      const { id, title, description } = action.payload;
      const existingTask = state.tasks.find((task) => task.id === id);
      if (existingTask) {
        existingTask.title = title;
        existingTask.description = description;
      }
    },
  },
});

export const { taskUpdated } = taskSlice.actions;

// ディスパッチされたアクションに応じて状態をどのように更新するかを定義
export const tasksReducer = taskSlice.reducer;
