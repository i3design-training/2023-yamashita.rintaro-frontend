import axiosBase from 'axios';

const BASEURL = import.meta.env.VITE_BASE_URL as string;

export const apiClient = axiosBase.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストが行われるたびに最新のトークンをヘッダーにセット
// Interceptor: HTTPリクエストとレスポンスに対してカスタムロジックを追加する
// config: axiosのリクエスト設定。主に以下の項目を設定する
//    baseURL: APIのベースとなるURL
//    headers: リクエストヘッダに追加する任意のキーと値
//    timeout: リクエストがタイムアウトするまでのミリ秒
//    params: リクエストパラメータを含むオブジェクト
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || '';
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
