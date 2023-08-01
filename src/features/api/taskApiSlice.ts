import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TaskWithColumnName } from '../../types/TaskWithColumnName';
import { TaskWithoutID } from '../../types/TaskWithoutID';
import { EditableTask, Task } from '../../types/task';

type FetchTasksQueryParams = {
  userId: string;
};

type FetchTaskQueryParams = {
  taskId: string;
};

const base_url = 'http://localhost:8000/api/';

export const tasksApiSlice = createApi({
  reducerPath: 'tasksApi',
  // fetchBaseQueryを使用してクエリまたはミューテーションがエラーをスローした場合、
  // エラーはそれぞれのフックのerrorプロパティに返される
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    prepareHeaders: (headers) => {
      try {
        const token = localStorage.getItem('token');
        if (token !== null) {
          headers.set('authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error(
          'localStorageからトークンを取得できませんでした。',
          error,
        );
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // タスクを取得するエンドポイント
    // ユーザーIDをパラメータとして受け取り、そのユーザーのタスクを取得します
    getTasks: builder.query<Task[], FetchTasksQueryParams>({
      query: ({ userId }) => `tasks?userId=${userId}`,
    }),
    fetchTask: builder.query<TaskWithColumnName, FetchTaskQueryParams>({
      query: ({ taskId }) => `/tasks/${taskId}`,
    }),
    // タスクを追加するエンドポイント
    // タスクデータをパラメータとして受け取り、新たなタスクを作成します
    addTask: builder.mutation<Task, { taskData: TaskWithoutID }>({
      query: ({ taskData }) => ({
        url: 'tasks/create',
        method: 'POST',
        body: taskData,
      }),
    }),
    updateTask: builder.mutation<
      TaskWithColumnName,
      { taskId: string; taskData: EditableTask }
    >({
      query: ({ taskId, taskData }) => ({
        url: `tasks/${taskId}`,
        method: 'PUT',
        body: taskData,
      }),
    }),
  }),
});

export const {
  useGetTasksQuery,
  useFetchTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
} = tasksApiSlice;
