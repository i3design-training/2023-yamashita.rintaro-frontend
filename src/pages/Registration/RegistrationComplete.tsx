import { Alert, Button, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../config/axios';

const RegistrationComplete = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);

  // tokenがある場合は本登録処理
  useEffect(() => {
    if (token) {
      const register = async (token: string) => {
        try {
          await apiClient.get(`/users/fullRegistration?token=${token}`);
        } catch (error) {
          setError('本登録処理に失敗しました。再度試してみてください。');
          console.log(error);
        }
      };
      void register(token);
    }
  }, [token]);

  const navigate = useNavigate();
  const onContinue = () => {
    navigate('/login');
  };

  return (
    <Container>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h4" component="h2" gutterBottom>
        登録が完了しました
      </Typography>
      <Button variant="contained" color="primary" onClick={onContinue}>
        ログインページへ
      </Button>
    </Container>
  );
};

export default RegistrationComplete;
