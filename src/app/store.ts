import { configureStore } from '@reduxjs/toolkit';

import { tasksApiSlice } from '../features/api/taskApiSlice';
import { tasksReducer } from '../features/tasks/tasksSlice';
import { usersReducer } from '../features/users/usersSlice';

// Reduxによる状態管理の全体像
//    1. Redux Storeの作成
//    2. Actionsの定義
//    3. ActionのDispatch
//    4. Reducerの実行
//    5. Storeの状態が更新
//    6. 新しい状態でViewを更新

// ストアはアプリケーションの状態を保持するためのオブジェクト。
// configureStoreは、Redux Toolkitにより提供されている関数で、ストアの設定を行う。
export const store = configureStore({
  // 各スライスのリデューサをキーとしてストアに登録。各キーは状態の一部分を表す。
  reducer: {
    users: usersReducer, // ユーザーに関する状態を管理するリデューサ
    tasks: tasksReducer, // タスクに関する状態を管理するリデューサ
    // APIスライスのリデューサ。RTK Queryの自動生成機能により作られる
    // ストアオブジェクト内での特定のキー（reducerPath）にリデューサとその状態データを格納する
    // これにより、APIスライスはAPIのキャッシュ状態と更新ロジックを管理できるようになる
    [tasksApiSlice.reducerPath]: tasksApiSlice.reducer,
  },
  // ミドルウェアを設定。ミドルウェアはアクションがリデューサに届く前に行う処理を定義できる。
  // apiSlice.middlewareを使用することで、RTK Queryによる非同期通信が可能になる。
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApiSlice.middleware),
});

// AppDispatchは、Redux Storeのdispatchメソッドの型を表現している。
// store.dispatchはアクションをリデューサーへディスパッチ（送信）するための関数。
// これにより、dispatch関数が正しい引数を取っていることをTypeScriptがチェック可能に。
export type AppDispatch = typeof store.dispatch;

// RootStateは、Redux Storeの全体的な状態を表す型。
// store.getStateは現在のストアの状態を返す関数で、ReturnTypeはその返り値の型を取る。
// これにより、ステートのどの部分がどのような型を持っているかをTypeScriptが理解できるようになる
export type RootState = ReturnType<typeof store.getState>;
