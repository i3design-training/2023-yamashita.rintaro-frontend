import { Typography } from '@mui/material';
import { FC } from 'react';

type ErrorMessageProps = {
  message?: string;
};

export const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <Typography color="error" variant="body2">
      {message}
    </Typography>
  );
};
