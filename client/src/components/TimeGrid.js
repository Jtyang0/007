import React, { useState, useEffect } from 'react';
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
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format, startOfDay, addMinutes, isSameDay, parseISO } from 'date-fns';
import { createTimeRecord, fetchTimeRecords, deleteTimeRecord } from '../store/slices/timeRecordSlice';
import { formatDuration } from '../utils/dateUtils';

const TimeGrid = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const { records } = useSelector((state) => state.timeRecords);
  const { categories } = useSelector((state) => state.categories);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    duration: 30,
    notes: '',
  });

  const timeSlots = [];
  const startHour = 0;
  const endHour = 24;
  const slotDuration = 30; // 30分钟一个时间段

  // 生成时间段
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const time = new Date(selectedDate);
      time.setHours(hour, minute, 0, 0);
      timeSlots.push(time);
    }
  }

  useEffect(() => {
    const start = startOfDay(selectedDate);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    
    dispatch(fetchTimeRecords({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    }));
  }, [dispatch, selectedDate]);

  // 获取时间段对应的记录
  const getRecordForSlot = (slotTime) => {
    return records.find(record => {
      const recordStart = parseISO(record.startTime);
      const recordEnd = new Date(recordStart.getTime() + record.duration * 60000);
      return slotTime >= recordStart && slotTime < recordEnd;
    });
  };

  // 获取分类颜色
  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#757575';
  };

  const handleSlotClick = (slotTime) => {
    const existingRecord = getRecordForSlot(slotTime);
    if (existingRecord) {
      // 如果已有记录，可以编辑或删除
      return;
    }
    
    setSelectedSlot(slotTime);
    setFormData({
      category: categories.length > 0 ? categories[0].name : '',
      duration: 30,
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    if (!formData.category) {
      return;
    }

    dispatch(createTimeRecord({
      category: formData.category,
      startTime: selectedSlot.toISOString(),
      duration: formData.duration,
      notes: formData.notes,
    }));

    setOpenDialog(false);
    setSelectedSlot(null);
  };

  const handleDelete = (recordId) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      dispatch(deleteTimeRecord(recordId));
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {format(selectedDate, 'yyyy年MM月dd日')} 时间轴
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr',
            gap: 1,
            maxHeight: '600px',
            overflowY: 'auto',
          }}
        >
          {timeSlots.map((slotTime, index) => {
            const record = getRecordForSlot(slotTime);
            const isFirstInHour = slotTime.getMinutes() === 0;
            const color = record ? getCategoryColor(record.category) : 'transparent';

            return (
              <React.Fragment key={index}>
                {isFirstInHour && (
                  <Box
                    sx={{
                      gridColumn: '1',
                      borderRight: '1px solid #e0e0e0',
                      pr: 1,
                      textAlign: 'right',
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                    }}
                  >
                    {format(slotTime, 'HH:mm')}
                  </Box>
                )}
                <Box
                  sx={{
                    gridColumn: isFirstInHour ? '2' : '1 / 3',
                    minHeight: '40px',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    bgcolor: color,
                    cursor: record ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1,
                    '&:hover': {
                      bgcolor: record ? color : '#f5f5f5',
                    },
                  }}
                  onClick={() => !record && handleSlotClick(slotTime)}
                >
                  {record && (
                    <>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {record.category}
                        </Typography>
                        {record.notes && (
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            {record.notes}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Typography variant="caption">
                          {formatDuration(record.duration)}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record._id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Box>
              </React.Fragment>
            );
          })}
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>添加时间记录</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="活动分类"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
            required
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      bgcolor: category.color,
                    }}
                  />
                  {category.name}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="持续时间（分钟）"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
            margin="normal"
            inputProps={{ min: 1, max: 1440 }}
            required
          />
          <TextField
            fullWidth
            label="备注（可选）"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            开始时间: {selectedSlot && format(selectedSlot, 'yyyy-MM-dd HH:mm')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.category}>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeGrid;

