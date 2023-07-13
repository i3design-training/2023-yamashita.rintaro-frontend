import { useEffect, useState, useMemo } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Outlet, useNavigate } from 'react-router-dom';
import { apiClient } from '../config/axios';
import { useToken } from '../context/TokenContext';

type HeaderProps = {
  sections: ReadonlyArray<{
    title: string;
    url: string;
  }>;
  title: string;
};

export default function Header({ sections, title }: HeaderProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [token, setToken, userId, setUserId, , setUserName] = useToken();
  const userName = localStorage.getItem('userName') || '';
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      // 明示的にboolean型に変換
      setIsLogin(!!token);
    };

    checkLoginStatus();
  }, [token]);

  const logout = async () => {
    try {
      await apiClient.post('/users/logout', { userId: userId });
      localStorage.removeItem('token');
      setIsLogin(false);
      setToken('');
      setUserId('');
      setUserName('');
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
        {isLogin ? (
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/profile`)}
            >
              Profile
            </Button>
            <Button variant="outlined" size="small" onClick={() => logout()}>
              ログアウト
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/login')}
            >
              ログイン
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/registration')}
            >
              新規登録
            </Button>
          </>
        )}
      </Toolbar>
      <Outlet />
    </>
  );
}
