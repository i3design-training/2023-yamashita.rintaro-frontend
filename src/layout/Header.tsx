import { useEffect, useState, useMemo } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Outlet, useNavigate } from 'react-router-dom';

type HeaderProps = {
  sections: ReadonlyArray<{
    title: string;
    url: string;
  }>;
  title: string;
};

export default function Header({ sections, title }: HeaderProps) {
  const [isLogin, setIsLogin] = useState(false);
  const userName = localStorage.getItem('userName') || '';
  const navigate = useNavigate();

  const navItems = useMemo(() => {
    return isLogin
      ? [
          { path: '/', name: 'Home' },
          { path: `/profile/${userName}`, name: 'Profile' },
        ]
      : [
          { path: '/login', name: 'ログイン' },
          { path: '/registration', name: '新規登録' },
        ];
  }, [isLogin, userName]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      // 明示的にboolean型に変換
      setIsLogin(!!token);
    };

    checkLoginStatus();
  }, []);

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
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/logout`)}
            >
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
      <Toolbar component="nav" variant="dense" sx={{ overflowX: 'auto' }}>
        {navItems.map((item) => (
          <Link
            color="inherit"
            noWrap
            key={item.name}
            variant="body2"
            href={item.path}
            sx={{ p: 1, flexShrink: 0 }}
          >
            {item.name}
          </Link>
        ))}
      </Toolbar>
      <Outlet />
    </>
  );
}
