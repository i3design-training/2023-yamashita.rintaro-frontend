import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

// トークンとその更新関数を持つcontextを作成。デフォルト値は空のトークンと空関数
const tokenContext = createContext<
  [
    string,
    Dispatch<SetStateAction<string>>,
    string,
    Dispatch<SetStateAction<string>>,
    string,
    Dispatch<SetStateAction<string>>,
  ]
>([
  '',
  () => {
    throw new Error('setToken function must be overridden');
  },
  '',
  () => {
    throw new Error('setUserId function must be overridden');
  },
  '',
  () => {
    throw new Error('setUserName function must be overridden');
  },
]);

type TokenProviderProps = {
  children: ReactNode;
};

export const TokenProvider: FC<TokenProviderProps> = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') ?? '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') ?? '');
  const [userName, setUserName] = useState(
    localStorage.getItem('userName') ?? '',
  );

  // 再ログイン時など、トークンが変更されたときにlocalStorageを更新
  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
  }, [token, userId, userName]);

  return (
    // 子コンポーネントからトークンを取得・更新可能に
    <tokenContext.Provider
      value={[token, setToken, userId, setUserId, userName, setUserName]}
    >
      {children}
    </tokenContext.Provider>
  );
};

export const useToken = () => useContext(tokenContext);
