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
import {
  AppBar,
  Avatar,
  Box,
  Container,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Logout } from '@mui/icons-material';

type HeaderProps = {
  sections: readonly {
    title: string;
    url: string;
  }[];
  title: string;
};

export default function Header({ sections, title }: HeaderProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [token, setToken, userId, setUserId, , setUserName] = useToken();
  const userName = localStorage.getItem('userName') || '';
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Typography
              component="h2"
              variant="h5"
              color="inherit"
              noWrap
              sx={{ flex: 1, display: { xs: 'none', md: 'flex' } }}
            >
              {title}
            </Typography>
            {isLogin ? (
              <>
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                  {/* ハンバーガーメニュー */}
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: 'block', md: 'none' },
                    }}
                  >
                    {sections.map((page) => (
                      <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page.title}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                {/* ヘッダーナビ */}
                <Box sx={{ flexGrow: 4, display: { xs: 'none', md: 'flex' } }}>
                  {sections.map((page) => (
                    <Button
                      key={page.title}
                      onClick={() => navigate(page.url)}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {page.title}
                    </Button>
                  ))}
                </Box>

                {/* プロフィールアイコン */}
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    {/* プロフィールアイコンクリック時に出るメニュー */}
                    <MenuItem onClick={() => navigate('profile')}>
                      <Avatar /> Profile{' '}
                    </MenuItem>
                    <MenuItem onClick={() => logout()}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      {'Logout'}
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              <>
                {/* 未ログイン時 */}
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => navigate('/login')}
                >
                  ログイン
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => navigate('/registration')}
                >
                  新規登録
                </Button>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </>
  );
}
