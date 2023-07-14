import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  Grid,
  Typography,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from '@mui/material';
import { apiClient } from '../../config/axios';
import CategoryCreateForm from '../../component/category/CategoryCreateForm';

type Category = {
  id: number;
  name: string;
};

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
          <Box sx={{ display: 'flex', my: 8, justifyContent: 'space-between' }}>
            <Typography variant="h3" textAlign={'center'}>
              Category
            </Typography>
            {/* カテゴリー作成 */}
            <Button
              variant="contained"
              onClick={() => setCategoryFormOpen(true)}
              sx={{ marginTop: 2 }}
            >
              カテゴリ作成
            </Button>
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
          </Box>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      textAlign={'center'}
                    >
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default Categories;
