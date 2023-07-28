import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { CircularProgress } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { registerUser } from '../../features/users/usersSlice';

const defaultTheme = createTheme();

type IFormInputs = {
  username: string;
  email: string;
  password: string;
};

const Registration = () => {
  const [error, setError] = useState('');
  const {
    // 各入力フィールドをReact Hook Formに登録するための関数
    register,
    // フォームの現在の状態を表すオブジェクトで、エラー情報を含む
    formState: { errors },
    // フォームの送信を処理するための関数
    handleSubmit,
  } = useForm<IFormInputs>();

  const dispatch = useDispatch<AppDispatch>();
  const registrationStatus = useSelector(
    (state: RootState) => state.users.status,
  );

  // dataは、React Hook FormのhandleSubmit関数から提供されるオブジェクト
  // フォームの各フィールドの現在の値を含んでいる
  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    // dataオブジェクトからusername、email、passwordを取り出す
    const { username, email, password } = data;

    try {
      const res = await dispatch(registerUser({ username, email, password }));
      // TODO: エラー時に画面にエラーメッセージを表示させる
      // reduxのpayloadの仕様で、エラーをcatchできない
      console.log(res);
    } catch (error) {
      setError(String(error));
      console.error('登録中にエラーが発生しました:', error);
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
            新規登録{' '}
          </Typography>

          {registrationStatus === 'loading' && <CircularProgress />}
          {registrationStatus === 'succeeded' && (
            <Typography color="primary">
              仮登録が完了しました。メールをご確認ください。
            </Typography>
          )}
          {registrationStatus === 'failed' && (
            <Typography color="error">仮登録失敗</Typography>
          )}

          {/* TODO: エラーメッセージを表示させる */}
          {error && <Typography color="error">{error}</Typography>}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="名前"
                  autoComplete="family-name"
                  {...register('username')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="メールアドレス"
                  autoComplete="email"
                  {...register('email')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="パスワード"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register('password')}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              新規登録{' '}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  ログインはこちら
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Registration;
