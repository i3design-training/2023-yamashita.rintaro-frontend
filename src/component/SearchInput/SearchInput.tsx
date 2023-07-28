import SearchIcon from '@mui/icons-material/Search';
import { Container, InputAdornment, TextField } from '@mui/material';
import { FC } from 'react';

export type SearchInputProps = {
  handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // フォームが閉じられる時に呼び出す関数
};

export const SearchInput: FC<SearchInputProps> = ({ handleFilterChange }) => {
  return (
    <Container maxWidth="md">
      <TextField
        id="search"
        type="search"
        label="Search"
        defaultValue=""
        onChange={handleFilterChange}
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
