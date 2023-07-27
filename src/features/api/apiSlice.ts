// React特有のエントリーポイントからRTK Queryのメソッドをインポート
import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { apiClient } from '../../config/axios';
import { Task } from '../../types/task';

type QueryParams = {
  userId: string;
};

// 単一のAPIスライスオブジェクトを定義
// createApiメソッドは、自動的にキャッシュ状態と更新ロジックを管理するためのリデューサとミドルウェアを生成
export const apiSlice = createApi({
  // createApiを使用して作成されたAPIスライスの名前（デフォルトではapi）
  // ストア内のAPIスライスのキャッシュ状態が保存される場所を指定
  reducerPath: 'api',
  // すべてのリクエストはapiClientから始まるURLを持ちます
  baseQuery: async ({
    url,
    method,
    body,
  }: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body: unknown;
  }) => {
    try {
      let result: AxiosResponse<unknown>;
      if (method === 'GET') {
        result = await apiClient.get(url);
      } else {
        result = await apiClient({ url, method, data: body });
      }
      return { data: result.data };
    } catch (axiosError) {
      return { error: axiosError };
    }
  },
  // "エンドポイント"はこのサーバーの操作とリクエストを表します
  // エンドポイントには、キャッシュ用のデータを返すクエリや、サーバに更新を送信するミューテーションがあります
  // builder パラメータを受け取り、builder.query() と builder.mutation()で
  // 作成されたエンドポイント定義を含むオブジェクトを返すコールバック関数を使用して定義される
  endpoints: (builder) => ({
    // "query"はサーバーの状態を変更せずにデータを取得するリクエストのために使用
    getTasks: builder.query<Task[], QueryParams>({
      query: ({ userId }) => ({
        url: `/tasks?userId=${userId}`,
        method: 'GET',
        body: null,
      }),
    }),
    addTask: builder.mutation({
      query: ({ taskData }: { taskData: unknown }) => ({
        url: '/tasks',
        method: 'POST',
        body: taskData,
      }),
    }),
  }),
});

// getPostsクエリエンドポイントの自動生成されたフックをエクスポートします
export const { useGetTasksQuery, useAddTaskMutation } = apiSlice;
