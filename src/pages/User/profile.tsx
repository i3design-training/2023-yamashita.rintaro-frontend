import { useEffect, useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { apiClient } from '../../config/axios';
import { useToken } from '../../context/TokenContext';

type User = {
  email?: string;
  username?: string;
};

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [, , userId, , username] = useToken();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await apiClient.get<User>(`/users/${username}`);
        console.log(result);
        setUser(result.data);
      } catch (error) {
        console.log('ユーザー取得失敗', error);
      }
    };

    void fetchUserData();
  }, [username]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({
        ...user,
        [event.target.name]: event.target.value,
      } as User); // User | null型であることを保証
    }
  };

  // const handleSubmit = async (event) => {
  //   if (user) {
  //     try {
  //       await apiClient.put(`/users/${username}`, {});
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

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
        {/* <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}> */}
        <Box component="form" noValidate sx={{ mt: 1 }}>
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
      </Box>
    </Container>
  ) : null;
};

export default UserProfile;
