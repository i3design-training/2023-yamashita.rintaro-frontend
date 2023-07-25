import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import {
  fetchUser,
  setUserName,
  updateUser,
} from '../../features/users/usersSlice';

const UserProfile = () => {
  const originalName = useSelector((state: RootState) => state.users.userName);
  const [username, setUsername] = useState(originalName);
  const [email, setEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  // const user = useSelector((state: RootState) => selectUser(state, username));

  useEffect(() => {
    // 1. レンダリング時に自分の情報を取得
    const fetchData = async () => {
      if (username) {
        try {
          const res = await dispatch(fetchUser(username));
          const data = res.payload as { username: string; email: string };
          setUsername(data.username);
          setEmail(data.email);
        } catch (error) {
          setErrorMessage('ユーザーの取得に失敗しました。');
        }
      }
    };

    void fetchData();
  }, []);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (username && email) {
      try {
        const res = await dispatch(
          // usernameはリクエストURLに含めるために送信。
          updateUser({ username: originalName, user: { username, email } }),
        );
        setSuccessMessage('プロフィールを更新しました。');
        console.log(res);
        dispatch(setUserName(username));
      } catch (error) {
        setErrorMessage('プロフィールの更新に失敗しました。');
      }
    }
  };

  return username && email ? (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          User Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={handleUsernameChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email Address"
            id="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update
          </Button>
        </Box>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </Box>
    </Container>
  ) : null;
};

export default UserProfile;
