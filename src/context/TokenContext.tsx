import {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  FC,
  ReactNode,
} from 'react';

// トークンとその更新関数を持つcontextを作成。デフォルト値は空のトークンと空関数
const TokenContext = createContext<[string, Dispatch<SetStateAction<string>>]>([
  '',
  () => {
    throw new Error('setToken function must be overridden');
  },
]);

type TokenProviderProps = {
  children: ReactNode;
};

export const TokenProvider: FC<TokenProviderProps> = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') ?? '');

  // 再ログイン時など、トークンが変更されたときにlocalStorageを更新
  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    // 子コンポーネントからトークンを取得・更新可能に
    <TokenContext.Provider value={[token, setToken]}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);
