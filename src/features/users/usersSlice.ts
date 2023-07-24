import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../config/axios';
import { LoginUserResponse } from '../../types/LoginUserResponse';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await apiClient.post<LoginUserResponse>('/users/login', {
        email,
        password,
      });
      console.log(response);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
);

const initialState = {
  token: localStorage.getItem('token') ?? '',
  userId: localStorage.getItem('userId') ?? '',
  userName: localStorage.getItem('userName') ?? '',
};

// Reduxでは、アプリケーション全体の状態を管理する。
// この全体の状態を「state」と呼ぶ
// このstateを更新するためには、Reducerという特殊な関数を使用する
// Reducerは、前のstateとアクションを引数に取り、新しいstateを返す
// Redux Toolkitが使用しているImmerというライブラリを用いることで、直接変更しても新しいstateオブジェクトが作成可能に

// createSlice: アクションクリエイターとリデューサーを一緒に作成
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // TSはaction.payloadをanyと判断するので、actionの型を明示的に指定する
    setToken: (state, action: PayloadAction<string>) => {
      // setTokenアクションが発行されたとき、そのアクションが持っているデータ（payload）をstateのtokenにセット
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      localStorage.setItem('userId', action.payload);
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
      localStorage.setItem('userName', action.payload);
    },
  },
});

export const { setToken, setUserId, setUserName } = userSlice.actions;

// ディスパッチされたアクションに応じて状態をどのように更新するかを定義
export const usersReducer = userSlice.reducer;
