import {
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CardItem } from '../../component/cardItem/CardItem';
import CategoryCreateForm from '../../component/category/CategoryCreateForm';
import TitleAndCreateButton from '../../component/titleAndCreateButton/titleAndCreateButton';
import { apiClient } from '../../config/axios';
import { Category } from '../../types/category';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient<Category[]>('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories().catch((error) => console.error(error));
  }, []);

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <Container component="main" maxWidth="md">
          <TitleAndCreateButton
            titleText="カテゴリ"
            onButtonClick={() => setCategoryFormOpen(true)}
          />
          <Dialog
            open={categoryFormOpen}
            onClose={() => setCategoryFormOpen(false)}
          >
            <DialogTitle>カテゴリ作成</DialogTitle>
            <DialogContent>
              <CategoryCreateForm
                handleCategoryClose={() => setCategoryFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <CardItem name={category.name} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default Categories;
