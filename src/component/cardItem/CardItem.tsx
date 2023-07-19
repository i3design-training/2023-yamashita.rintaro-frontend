import { Card, CardContent, Typography } from '@mui/material';
import { FC } from 'react';

type CardProps = {
  name: string;
};

export const CardItem: FC<CardProps> = ({ name }) => {
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography component="div" textAlign="center">
            {name}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
