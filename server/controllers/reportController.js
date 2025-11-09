const TimeRecord = require('../models/TimeRecord');
const Category = require('../models/Category');

// 生成报表数据
exports.generateReport = async (req, res) => {
  try {
    const { type = 'day', startDate, endDate } = req.query;

    let start, end;
    const now = new Date();

    // 根据类型计算日期范围
    switch (type) {
      case 'day':
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'week':
        const dayOfWeek = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      default:
        if (startDate && endDate) {
          start = new Date(startDate);
          end = new Date(endDate);
        } else {
          return res.status(400).json({
            success: false,
            message: '请提供日期范围或选择报表类型'
          });
        }
    }

    // 查询时间记录
    const records = await TimeRecord.find({
      startTime: { $gte: start, $lte: end }
    }).sort({ startTime: 1 });

    // 获取所有分类信息
    const categories = await Category.find();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = {
        color: cat.color,
        type: cat.type,
        icon: cat.icon
      };
    });

    // 统计各分类的时间
    const categoryStats = {};
    let totalTime = 0;
    let positiveTime = 0;

    records.forEach(record => {
      const { category, duration } = record;
      if (!categoryStats[category]) {
        categoryStats[category] = {
          name: category,
          duration: 0,
          count: 0,
          color: categoryMap[category]?.color || '#757575',
          type: categoryMap[category]?.type || 'neutral'
        };
      }
      categoryStats[category].duration += duration;
      categoryStats[category].count += 1;
      totalTime += duration;
      
      if (categoryMap[category]?.type === 'positive') {
        positiveTime += duration;
      }
    });

    // 转换为数组
    const categoryData = Object.values(categoryStats);

    // 计算趋势（与上一周期对比）
    let previousStart, previousEnd;
    switch (type) {
      case 'day':
        previousStart = new Date(start);
        previousStart.setDate(previousStart.getDate() - 1);
        previousEnd = new Date(end);
        previousEnd.setDate(previousEnd.getDate() - 1);
        break;
      case 'week':
        previousStart = new Date(start);
        previousStart.setDate(previousStart.getDate() - 7);
        previousEnd = new Date(end);
        previousEnd.setDate(previousEnd.getDate() - 7);
        break;
      case 'month':
        previousStart = new Date(start.getFullYear(), start.getMonth() - 1, 1);
        previousEnd = new Date(start.getFullYear(), start.getMonth(), 0, 23, 59, 59, 999);
        break;
    }

    const previousRecords = await TimeRecord.find({
      startTime: { $gte: previousStart, $lte: previousEnd }
    });

    let previousTotalTime = 0;
    previousRecords.forEach(record => {
      previousTotalTime += record.duration;
    });

    const timeChange = previousTotalTime > 0 
      ? ((totalTime - previousTotalTime) / previousTotalTime * 100).toFixed(1)
      : 0;

    // 生成趋势数据（按日期）
    const trendData = {};
    records.forEach(record => {
      const dateKey = record.startTime.toISOString().split('T')[0];
      if (!trendData[dateKey]) {
        trendData[dateKey] = 0;
      }
      trendData[dateKey] += record.duration;
    });

    const trend = Object.keys(trendData)
      .sort()
      .map(date => ({
        date,
        duration: trendData[date]
      }));

    res.json({
      success: true,
      data: {
        type,
        period: {
          start: start.toISOString(),
          end: end.toISOString()
        },
        summary: {
          totalTime,
          positiveTime,
          positiveRatio: totalTime > 0 ? ((positiveTime / totalTime) * 100).toFixed(1) : 0,
          recordCount: records.length,
          timeChange: parseFloat(timeChange)
        },
        categoryData,
        trend
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '生成报表失败',
      error: error.message
    });
  }
};


