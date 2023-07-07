import React, { useEffect } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { baseUrl } from '../../config/axios';

const RegistrationComplete = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  // tokenがある場合は本登録処理
  useEffect(() => {
    if (token) {
      const register = async (token: string) => {
        try {
          await baseUrl.get(`/users/fullRegistration?token=${token}`);
        } catch (error) {
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
