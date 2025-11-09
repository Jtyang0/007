import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { generateReport } from '../store/slices/reportSlice';
import { formatDuration } from '../utils/dateUtils';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { report, loading } = useSelector((state) => state.reports);
  const [tabValue, setTabValue] = useState('day');

  useEffect(() => {
    dispatch(generateReport({ type: tabValue }));
  }, [dispatch, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report) {
    return null;
  }

  // 饼图配置
  const pieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}分钟 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '时间分配',
        type: 'pie',
        radius: '50%',
        data: report.categoryData.map((item) => ({
          value: item.duration,
          name: item.name,
          itemStyle: { color: item.color },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // 趋势图配置
  const trendOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const param = params[0];
        return `${param.name}<br/>${param.seriesName}: ${formatDuration(param.value)}`;
      },
    },
    xAxis: {
      type: 'category',
      data: report.trend.map((item) => item.date),
    },
    yAxis: {
      type: 'value',
      name: '时间（分钟）',
    },
    series: [
      {
        name: '记录时间',
        type: 'line',
        data: report.trend.map((item) => item.duration),
        smooth: true,
        areaStyle: {},
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        数据看板
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="日报" value="day" />
          <Tab label="周报" value="week" />
          <Tab label="月报" value="month" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {/* 统计摘要 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              统计摘要
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                总记录时间
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {formatDuration(report.summary.totalTime)}
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                有效时间占比
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {report.summary.positiveRatio}%
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                记录条数
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {report.summary.recordCount}
              </Typography>
            </Box>
            {report.summary.timeChange !== 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  与上期对比
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: report.summary.timeChange > 0 ? 'error.main' : 'success.main',
                  }}
                >
                  {report.summary.timeChange > 0 ? '+' : ''}
                  {report.summary.timeChange}%
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 时间分配饼图 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              时间分配
            </Typography>
            <ReactECharts option={pieOption} style={{ height: '400px' }} />
          </Paper>
        </Grid>

        {/* 趋势图 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              时间趋势
            </Typography>
            <ReactECharts option={trendOption} style={{ height: '300px' }} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

