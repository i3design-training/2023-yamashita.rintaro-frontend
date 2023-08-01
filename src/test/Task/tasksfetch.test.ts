// 必要なパッケージと関数をインポート
import { configureStore } from '@reduxjs/toolkit';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { tasksApiSlice } from '../../features/api/taskApiSlice';

const jestMockUserId = '99c8d135-ff57-4d08-8290-9c0fdf8a4ede';
const jestMockId = '99c8d18e-b511-4d8f-8d4d-a8feb859604e';
const jestMockTitle = 'Jest Test Task';
const jestMockDescription = 'Jest Test Task';
const jestMockDueDate = String(new Date());
const jestMockCategoryId = '999e849c-cfe6-4380-b529-1bfaff907214';
const jestMockStatusId = '999e02d9-e953-4ff6-bdf1-c3c0f736c84c';
// モックサーバーを設定
const server = setupServer(
  rest.get(
    `http://localhost:8000/api/tasks?userId=${jestMockUserId}`,
    (req, res, ctx) => {
      return res(
        // ctx.jsonはレスポンスボディをJSON形式で設定するための関数
        ctx.json([
          {
            id: jestMockId,
            title: jestMockTitle,
            description: jestMockDescription,
            due_date: jestMockDueDate,
            category_id: jestMockCategoryId,
            status_id: jestMockStatusId,
          },
        ]),
      );
    },
  ),
);

// テストの前後でモックサーバーを起動/停止
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// APIスライスを含むストアを設定
const store = configureStore({
  reducer: {
    [tasksApiSlice.reducerPath]: tasksApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApiSlice.middleware),
});

test('getTasks endpoint', async () => {
  // getTasksエンドポイントを呼び出し
  await store.dispatch(
    tasksApiSlice.endpoints.getTasks.initiate({
      userId: jestMockUserId,
    }),
  );

  // 結果を検証
  const tasks = tasksApiSlice.endpoints.getTasks.select({
    userId: jestMockUserId,
  })(store.getState());

  expect(tasks).toEqual(
    expect.objectContaining({
      data: [
        {
          id: jestMockId,
          title: jestMockTitle,
          description: jestMockDescription,
          due_date: jestMockDueDate,
          category_id: jestMockCategoryId,
          status_id: jestMockStatusId,
        },
      ],
    }),
  );
});
