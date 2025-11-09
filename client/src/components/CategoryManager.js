import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Grid,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { createCategory, updateCategory, deleteCategory, fetchCategories } from '../store/slices/categorySlice';

const CategoryManager = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#1976d2',
    type: 'neutral',
    icon: 'circle',
  });

  const colors = [
    '#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f',
    '#0288d1', '#388e3c', '#f57c00', '#7b1fa2', '#c62828',
  ];

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        color: category.color,
        type: category.type,
        icon: category.icon,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        color: '#1976d2',
        type: 'neutral',
        icon: 'circle',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      return;
    }

    if (editingCategory) {
      dispatch(updateCategory({ id: editingCategory._id, data: formData }));
    } else {
      dispatch(createCategory(formData));
    }
    handleCloseDialog();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`确定要删除分类"${name}"吗？`)) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">活动分类管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          添加分类
        </Button>
      </Box>

      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category._id}>
            <Paper
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: category.color,
                  }}
                />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {category.name}
                  </Typography>
                  <Chip
                    label={
                      category.type === 'positive' ? '正' :
                      category.type === 'negative' ? '负' : '平'
                    }
                    size="small"
                    color={
                      category.type === 'positive' ? 'success' :
                      category.type === 'negative' ? 'error' : 'default'
                    }
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
              <Box>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(category)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                {!category.isDefault && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(category._id, category.name)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? '编辑分类' : '添加分类'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="分类名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            select
            fullWidth
            label="类型"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            margin="normal"
          >
            <MenuItem value="positive">正（积极）</MenuItem>
            <MenuItem value="negative">负（消极）</MenuItem>
            <MenuItem value="neutral">平（中性）</MenuItem>
          </TextField>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>选择颜色</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {colors.map((color) => (
                <Box
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: color,
                    cursor: 'pointer',
                    border: formData.color === color ? '3px solid #000' : 'none',
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.name.trim()}>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CategoryManager;

