import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';

// テスト用のストアを作成
const store = configureStore({
  reducer: {
    // reducerPath: 'api'のreducerを取得
    api: apiSlice.reducer,
  },
  // Reduxストアに、デフォルトのミドルウェアとRTK Queryのミドルウェアの両方を適用する
  // getDefaultMiddleware関数は、Redux Toolkitが提供するデフォルトのミドルウェアセットを取得する
  // concat(apiSlice.middleware)は、デフォルトのミドルウェアの配列にapiSlice.middlewareを追加
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

describe('API Slice', () => {
  it('fetches tasks successfully', () => {
    // モックデータ
    const mockData = [
      {
        title: 'Test Task',
        description: 'Test Task Desc',
        due_date: '2023-07-31',
        category_id: '999dfe0f-e7c8-448b-9c19-2c3bd28db4fe',
        status_id: '999e02d9-e953-4ff6-bdf1-c3c0f736c84c',
        user_id: '99c0d282-2071-43a9-a2fc-75fcfb2c3df5',
      },
    ];

    // APIのレスポンスをモック

    // フックをレンダリング

    // フックを実行

    // 状態の更新を待つ

    // 結果を確認
    // expect(result.current.data).toEqual(mockData);
  });
});
