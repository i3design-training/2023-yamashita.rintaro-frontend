import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '../../app/store';
import { TaskWithoutID } from '../../component/task/TaskCreateForm';
import { apiClient } from '../../config/axios';
import { TaskWithColumnName } from '../../pages/Task/TaskDetail';
import { Task } from '../../types/task';

type TaskState = {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

type TaskUpdatedPayload = {
  id: string;
  title: string;
  description: string;
};

const initialState: TaskState = { tasks: [], status: 'idle', error: null };

// createAsyncThunkは2つの引数を受け取ります。
//    アクションのタイププレフィックス：
//        この例では、'tasks/fetchTasks'
//        この文字列は、生成されるアクションのタイプを決定
//        createAsyncThunkは、このプレフィックスを使用して3つのアクションタイプを自動的に生成します：
//            'tasks/fetchTasks/pending'
//            'tasks/fetchTasks/fulfilled'
//            'tasks/fetchTasks/rejected'
//    ペイロードクリエーター関数：
//        この関数はasyncであるため、非同期処理を行い、Promiseを返すことができる
//        ペイロードクリエーター関数は、通常2つの引数を取ります：
//            arg：非同期関数に渡す引数。必要ない場合は_に置き換えられる
//            thunkAPI：いくつかのフィールドを持つオブジェクトで、dispatchやgetStateなどの関数を含む
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId: string) => {
    const response = await apiClient.get<Task[]>('/tasks', {
      params: { userId },
    });
    return response.data;
  },
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId: string, thunkAPI) => {
    try {
      const response = await apiClient.get<TaskWithColumnName>(
        `/tasks/${taskId}`,
      );
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const error: AxiosError = err;
        console.log(error);
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw err;
    }
  },
);

export const addNewTask = createAsyncThunk(
  'tasks/addNewTask',
  // The payload creator receives the partial `{title, content, user}` object
  async (task: TaskWithoutID, thunkAPI) => {
    try {
      const response = await apiClient.post<Task>('/tasks/create', task);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const error: AxiosError = err;
        console.log(error);
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw err;
    }
  },
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ taskId, task }: { taskId: string; task: Task }, thunkAPI) => {
    try {
      console.log(taskId, task);
      const response = await apiClient.put<Task>(`/tasks/${taskId}/edit`, task);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const error: AxiosError = err;
        console.log('タスクupdate失敗', error);
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw err;
    }
  },
);

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
  // 特定のスライスの状態を更新するための追加のリデューサーを定義する
  // アクションタイプをリッスンし、それらのアクションに基づいてステートを更新するリデューサーを作成
  extraReducers(builder) {
    // addCaseなど、特定のアクションタイプに対応するリデューサーを追加するためのメソッドを提供
    builder
      // addCaseメソッドは、特定のアクションタイプに対応するリデューサーを追加する
      .addCase(fetchTasks.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks.push(action.payload);
      })
      .addCase(addNewTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export const selectAllTasks = (state: RootState) => state.tasks.tasks;

export const selectTaskById = (state: RootState, taskId: string) =>
  state.tasks.tasks.find((task) => task.id === taskId);

export const { taskUpdated } = taskSlice.actions;

// ディスパッチされたアクションに応じて状態をどのように更新するかを定義
export const tasksReducer = taskSlice.reducer;
