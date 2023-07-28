import { yupResolver } from '@hookform/resolvers/yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { AppDispatch } from '../../app/store';
import {
  loginUser,
  setToken,
  setUserId,
  setUserName,
} from '../../features/users/usersSlice';
import { loginSchema } from '../../helpers/validationSchemas';

const defaultTheme = createTheme();

const SignIn = () => {
  type UserLoginData = yup.InferType<typeof loginSchema>;

  const {
    // 各入力フィールドをReact Hook Formに登録するための関数
    register,
    // フォームの現在の状態を表すオブジェクトで、エラー情報を含む
    formState: { errors },
    // フォームの送信を処理するための関数
    handleSubmit,
  } = useForm<UserLoginData>({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLoginSubmit: SubmitHandler<UserLoginData> = async (data) => {
    // dataオブジェクトからemail、passwordを取り出す
    const { email, password } = data;
    try {
      const actionResult = await dispatch(loginUser({ email, password }));
      const result = unwrapResult(actionResult);
      if (result) {
        dispatch(setToken(result.token));
        dispatch(setUserId(result.user_id));
        dispatch(setUserName(result.username));
        navigate('/');
      } else {
        console.error('No payload returned');
      }
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            ログイン
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(handleLoginSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              {...register('email')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              ログイン
            </Button>
            <Link href="#" variant="body2">
              新規登録はこちら
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
