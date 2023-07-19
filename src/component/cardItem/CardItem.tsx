import { Card, CardContent, Typography } from '@mui/material';
import { FC } from 'react';

type cardProps = {
  name: string;
};

const CardItem: FC<cardProps> = ({ name }) => {
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div" textAlign={'center'}>
            {name}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default CardItem;
