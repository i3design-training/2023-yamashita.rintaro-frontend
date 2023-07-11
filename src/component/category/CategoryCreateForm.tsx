import { DialogActions, TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import { apiClient } from '../../config/axios';

type CategoryFormProps = {
  handleCategoryClose: () => void;
};

const CategoryCreateForm: React.FC<CategoryFormProps> = ({
  handleCategoryClose,
}) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/categories/create', {
        name: categoryName,
      });
      console.log(res);
      setCategoryName('');
      handleCategoryClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`カテゴリー作成エラー: ${err.message}`);
      }
    }
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

export default CategoryCreateForm;
