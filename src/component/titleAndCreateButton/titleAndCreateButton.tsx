import { FC } from 'react';
import { Typography, Button, Box } from '@mui/material';

type TitleAndCreateButtonProps = {
  titleText: string;
  onButtonClick: () => void;
};

const TitleAndCreateButton: FC<TitleAndCreateButtonProps> = ({
  titleText,
  onButtonClick,
}) => (
  <Box sx={{ display: 'flex', my: 8, justifyContent: 'space-between' }}>
    <Typography id="title" variant="h3" textAlign={'center'}>
      {titleText}
    </Typography>
    <Button variant="contained" onClick={onButtonClick} sx={{ my: 0.5 }}>
      {titleText}作成
    </Button>
  </Box>
);

export default TitleAndCreateButton;
