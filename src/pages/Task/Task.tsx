import {
  List,
  Box,
  TextField,
  Checkbox,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Button,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function Tasks() {
  const [checked, setChecked] = useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <>
      <Typography variant="h4" component="h4">
        TODOリスト
      </Typography>
      ;
      <Box sx={{ display: 'flex' }}>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { marginRight: '20px', width: '50ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="TODOを入力してください"
            variant="outlined"
          />
        </Box>

        <Button variant="contained">追加</Button>
      </Box>
      <List sx={{ width: '100%', maxWidth: 540, bgcolor: 'background.paper' }}>
        {[0, 1, 2, 3].map((value) => {
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem key={value} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={handleToggle(value)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
              </ListItemButton>
              <Button variant="contained" sx={{ marginRight: '20px' }}>
                編集
              </Button>
              <Button variant="contained">削除</Button>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
