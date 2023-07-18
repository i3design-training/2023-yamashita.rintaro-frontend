import { Container, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FC } from 'react';

type InputProps = {
  handleFilter: (e: React.ChangeEvent<HTMLInputElement>) => void; // フォームが閉じられる時に呼び出す関数
};

const SearchInput: FC<InputProps> = ({ handleFilter }) => {
  return (
    <Container maxWidth="md">
      <TextField
        id="search"
        type="search"
        label="Search"
        defaultValue={''}
        onChange={handleFilter}
        InputProps={{
          // TextFiledにアイコンなどの装飾をする
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Container>
  );
};

export default SearchInput;
