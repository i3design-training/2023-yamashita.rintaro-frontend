import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import React, { useState } from 'react';

type CategoryFormProps = {
  open: boolean;
  handleCategoryClose: () => void;
  handleCategorySubmit: (categoryName: string) => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  handleCategoryClose,
  handleCategorySubmit,
}) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCategorySubmit(categoryName);
    setCategoryName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="カテゴリ名"
        type="text"
        fullWidth
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <DialogActions>
        <Button onClick={handleCategoryClose} color="primary">
          キャンセル
        </Button>
        <Button type="submit" color="primary">
          作成
        </Button>
      </DialogActions>
    </form>
  );
};

export default CategoryForm;
