import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { apiClient } from '../../config/axios';
import { LoginUserResponse } from '../../types/LoginUserResponse';
import { User } from '../../types/User';

type UserState = {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
  token: string;
  userId: string;
  userName: string;
};

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
  token: localStorage.getItem('token') ?? '',
  userId: localStorage.getItem('userId') ?? '',
  userName: localStorage.getItem('userName') ?? '',
};

// createAsyncThunk: 非同期処理をより簡単に扱うためのユーティリティ関数
//    非同期アクションを作成する際に、通常は3つのアクションタイプ（request, success, failure）を定義し、
//    それぞれのアクションでReduxのステートを手動で更新するが、createAsyncThunkは、これを自動化
//    特定の非同期処理を行う関数を引数として受け取り、
//    その非同期処理の開始、成功、失敗に対応する3つのアクションタイプを自動的に生成

// thunkAPI: createAsyncThunkの第二引数として提供されるオブジェクト
//    Redux Thunk内で有用な機能やメタデータにアクセスする
//    thunkAPIには以下のフィールドが含まれる：
//      dispatch: 現在のReduxストアへのディスパッチ関数。非同期関数（thunk）の中から他のアクションをディスパッチ可能に
//      getState: 現在のReduxストアのステートを返す関数。非同期関数の中から現在のステートを取得可能に
//      extra: configureStoreのthunkオプションで指定された追加の引数が格納される。これを通じて、非同期関数の中からカスタムロジックやAPIクライアントなどにアクセス可能に
//      requestId: 現在実行中のthunkアクションに対して生成された一意のID。ある特定のthunkアクションリクエストに関連付けて情報を追跡可能に
//      signal: AbortControllerインスタンスのAbortSignal。thunk関数の実行を途中でキャンセル可能に
//      rejectWithValue: エラーハンドリング時にカスタムエラーデータを返すためのユーティリティ関数。特定のエラーメッセージやコードを含むカスタムエラーオブジェクトを生成可能に

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (
    { email, password }: { email: string; password: string },
    thunkAPI,
  ) => {
    try {
      const response = await apiClient.post<LoginUserResponse>('/users/login', {
        email,
        password,
      });
      console.log(response);
      return response.data;
      // unknownを使用することで型安全性を保ちつつ、任意の型のエラー(今回はAxiosエラー)をキャッチすることが可能に
    } catch (err: unknown) {
      // 大体axiosエラーなので、AxiosErrorという型を使用
      if (axios.isAxiosError(err)) {
        const error: AxiosError = err;
        console.log(error);
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw err;
    }
  },
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (userId: string, thunkAPI) => {
    try {
      await apiClient.post('/users/logout', { userId });
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

export const registerUser = createAsyncThunk(
  'users/register',
  async (
    data: { username: string; email: string; password: string },
    thunkAPI,
  ) => {
    try {
      const response = await apiClient.post<User>(
        '/users/provisionalRegister',
        data,
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

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (username: string, thunkAPI) => {
    try {
      const response = await apiClient.get<User>(`/users/${username}`);
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

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ username, user }: { username: string; user: User }, thunkAPI) => {
    try {
      console.log(username, user);
      const response = await apiClient.put<User>(
        `/users/${username}/edit`,
        user,
      );
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const error: AxiosError = err;
        console.log('ユーザーupdate失敗', error);
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw err;
    }
  },
);

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
      localStorage.setItem('token', action.payload ?? '');
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      localStorage.setItem('userId', action.payload ?? '');
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
      localStorage.setItem('userName', action.payload ?? '');
    },
  },
  // extraReducers: スライス外のアクションに対するレスポンスを定義する
  // スライス外（別のスライスや非同期関数（thunk）から発行される）
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        // ログアウト後にstateを初期状態にリセット
        state.token = '';
        state.userId = '';
        state.userName = '';
        // stateとローカルストレージを一致させ、互いに反映するように保つ
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // レスポンスデータがアクションのpayloadとして提供され、stateのuserにセット
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        // エラー情報がアクションのerrorとして提供され、その中のmessageがstateのerrorにセット
        state.error = action.error.message;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectUser = createSelector(
  (state: { user: UserState }) => state.user,
  (user) => user,
);

// アクションクリエーター
export const { setToken, setUserId, setUserName } = userSlice.actions;

// ディスパッチされたアクションに応じて状態をどのように更新するかを定義
export const usersReducer = userSlice.reducer;
