import { FC, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../context/TokenContext';

type AuthRouteProps = {
  children: ReactNode;
};

export const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  const [token] = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return <>{children}</>;
};
