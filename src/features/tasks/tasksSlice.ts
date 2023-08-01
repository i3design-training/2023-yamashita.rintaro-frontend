import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
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

export const selectAllTasks = (state: RootState) => state.tasks.tasks;

export const selectTaskById = (state: RootState, taskId: string) =>
  state.tasks.tasks.find((task) => task.id === taskId);

// export const { taskUpdated } = taskSlice.actions;

// ディスパッチされたアクションに応じて状態をどのように更新するかを定義
export const tasksReducer = taskSlice.reducer;
