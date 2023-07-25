import { configureStore } from '@reduxjs/toolkit';

import { usersReducer } from '../features/users/usersSlice';

// Reduxによる状態管理の全体像
//    1. Redux Storeの作成
//    2. Actionsの定義
//    3. ActionのDispatch
//    4. Reducerの実行
//    5. Storeの状態が更新
//    6. 新しい状態でViewを更新

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

// AppDispatchは、Redux Storeのdispatchメソッドの型を表現している。
// store.dispatchはアクションをリデューサーへディスパッチ（送信）するための関数。
// これにより、dispatch関数が正しい引数を取っていることをTypeScriptがチェック可能に。
export type AppDispatch = typeof store.dispatch;

// RootStateは、Redux Storeの全体的な状態を表す型。
// store.getStateは現在のストアの状態を返す関数で、ReturnTypeはその返り値の型を取る。
// これにより、ステートのどの部分がどのような型を持っているかをTypeScriptが理解できるようになる
export type RootState = ReturnType<typeof store.getState>;
