import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Tabs,
  Tab,
} from '@mui/material';
import { Dashboard as DashboardIcon, Category as CategoryIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import { fetchCategories } from './store/slices/categorySlice';
import Dashboard from './components/Dashboard';
import TimeGrid from './components/TimeGrid';
import CategoryManager from './components/CategoryManager';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [navValue, setNavValue] = React.useState(0);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) {
      setNavValue(0);
    } else if (path.includes('time-grid')) {
      setNavValue(1);
    } else if (path.includes('categories')) {
      setNavValue(2);
    }
  }, [location.pathname]);

  const handleNavChange = (event, newValue) => {
    setNavValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/dashboard');
        break;
      case 1:
        navigate('/time-grid');
        break;
      case 2:
        navigate('/categories');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            时间开销记录仪
          </Typography>
        </Toolbar>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Container>
            <Tabs value={navValue} onChange={handleNavChange}>
              <Tab icon={<DashboardIcon />} label="数据看板" />
              <Tab icon={<ScheduleIcon />} label="时间轴" />
              <Tab icon={<CategoryIcon />} label="分类管理" />
            </Tabs>
          </Container>
        </Box>
      </AppBar>

      <Routes>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/time-grid"
          element={
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">时间轴记录</Typography>
                <Box>
                  <Button
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      newDate.setDate(newDate.getDate() - 1);
                      setCurrentDate(newDate);
                    }}
                  >
                    前一天
                  </Button>
                  <Button
                    onClick={() => setCurrentDate(new Date())}
                    variant="outlined"
                    sx={{ mx: 1 }}
                  >
                    今天
                  </Button>
                  <Button
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      newDate.setDate(newDate.getDate() + 1);
                      setCurrentDate(newDate);
                    }}
                  >
                    后一天
                  </Button>
                </Box>
              </Box>
              <TimeGrid selectedDate={currentDate} />
            </Container>
          }
        />
        <Route
          path="/categories"
          element={
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <CategoryManager />
            </Container>
          }
        />
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </Box>
  );
}

export default App;

