import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { apiClient } from '../../config/axios';
import { useToken } from '../../context/TokenContext';

type User = {
  email?: string;
  username?: string;
};

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [, , , , username, setUserName] = useToken();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      try {
        const result = await apiClient.get<User>(`/users/${username}`);
        setUser(result.data);
      } catch (error) {
        setErrorMessage('ユーザー取得失敗');
      }
    };

    void fetchUserData();
  }, [username]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({
        ...user,
        [event.target.name]: event.target.value,
      } as User);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // userがnullまたはundefinedでない場合にのみusernameプロパティにアクセス
    if (user?.username) {
      try {
        await apiClient.put(`/users/${username}/edit`, user);
        setUserName(user.username);
        setSuccessMessage('ユーザー情報が更新されました');
      } catch (error) {
        setErrorMessage('ユーザー情報の更新に失敗しました');
      }
    }
  };

  return user ? (
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
            value={user.username}
            onChange={handleChange}
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
            value={user.email}
            onChange={handleChange}
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
