# API 接口文档

## 基础信息

- 基础URL: `http://localhost:5000/api`
- 认证方式: 无需认证（单用户模式）
- 请求格式: JSON
- 响应格式: JSON

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": { ... }
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "errors": [ ... ]  // 可选，验证错误详情
}
```

## 时间记录接口

### 创建时间记录
- **URL**: `/time-records`
- **方法**: `POST`
- **认证**: 不需要
- **请求体**:
```json
{
  "category": "string (活动分类名称)",
  "startTime": "ISO 8601 日期时间",
  "duration": "number (分钟, 1-1440)",
  "notes": "string (可选, 最多200字符)",
  "tags": ["string"] (可选)
}
```

### 获取时间记录列表
- **URL**: `/time-records`
- **方法**: `GET`
- **认证**: 不需要
- **查询参数**:
  - `startDate`: 开始日期 (ISO 8601)
  - `endDate`: 结束日期 (ISO 8601)
  - `category`: 分类名称 (可选)
  - `page`: 页码 (默认: 1)
  - `limit`: 每页数量 (默认: 100)

### 获取单个时间记录
- **URL**: `/time-records/:id`
- **方法**: `GET`
- **认证**: 不需要

### 更新时间记录
- **URL**: `/time-records/:id`
- **方法**: `PUT`
- **认证**: 不需要
- **请求体**: 同创建接口

### 删除时间记录
- **URL**: `/time-records/:id`
- **方法**: `DELETE`
- **认证**: 不需要

## 分类管理接口

### 创建分类
- **URL**: `/categories`
- **方法**: `POST`
- **认证**: 不需要
- **请求体**:
```json
{
  "name": "string (最多20字符)",
  "color": "string (十六进制颜色, 可选)",
  "type": "string (positive|negative|neutral, 可选)",
  "icon": "string (可选)"
}
```

### 获取分类列表
- **URL**: `/categories`
- **方法**: `GET`
- **认证**: 不需要

### 更新分类
- **URL**: `/categories/:id`
- **方法**: `PUT`
- **认证**: 不需要
- **请求体**: 同创建接口

### 删除分类
- **URL**: `/categories/:id`
- **方法**: `DELETE`
- **认证**: 不需要

## 报表接口

### 生成报表
- **URL**: `/reports`
- **方法**: `GET`
- **认证**: 不需要
- **查询参数**:
  - `type`: 报表类型 (`day`|`week`|`month`)
  - `startDate`: 开始日期 (ISO 8601, 可选)
  - `endDate`: 结束日期 (ISO 8601, 可选)
- **响应数据**:
```json
{
  "type": "day|week|month",
  "period": {
    "start": "ISO 8601",
    "end": "ISO 8601"
  },
  "summary": {
    "totalTime": 120,
    "positiveTime": 90,
    "positiveRatio": "75.0",
    "recordCount": 5,
    "timeChange": 15.5
  },
  "categoryData": [
    {
      "name": "工作",
      "duration": 90,
      "count": 3,
      "color": "#1976d2",
      "type": "positive"
    }
  ],
  "trend": [
    {
      "date": "2024-01-01",
      "duration": 120
    }
  ]
}
```

## 状态码

- `200`: 成功
- `201`: 创建成功
- `400`: 请求错误（验证失败等）
- `404`: 资源不存在
- `500`: 服务器错误

