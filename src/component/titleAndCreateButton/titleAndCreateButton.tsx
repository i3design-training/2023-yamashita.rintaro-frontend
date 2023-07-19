import { Box, Button, Typography } from '@mui/material';
import { FC } from 'react';

export type TitleAndCreateButtonProps = {
  titleText: string;
  onButtonClick: () => void;
};

export const TitleAndCreateButton: FC<TitleAndCreateButtonProps> = ({
  titleText,
  onButtonClick,
}) => (
  <Box sx={{ display: 'flex', my: 8, justifyContent: 'space-between' }}>
    <Typography id="title" variant="h3" textAlign="center">
      {titleText}
    </Typography>
    <Button variant="contained" onClick={onButtonClick} sx={{ my: 0.5 }}>
      {titleText}作成
    </Button>
  </Box>
);
