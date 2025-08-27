### 7. 预测历史列表

**接口描述**: 获取用户的预测历史记录列表

**路由**: `GET /api/predict/history/`

**请求参数**:

- `page`: 页码（可选，整数，默认1）
- `page_size`: 每页数量（可选，整数，默认20）
- `type`: 预测类型筛选（可选，字符串，employment_rate/salary_prediction/job_duration/comprehensive）
- `start_date`: 开始日期（可选，日期字符串，格式：YYYY-MM-DD）
- `end_date`: 结束日期（可选，日期字符串，格式：YYYY-MM-DD）

**请求体**: 无

**返回体**:

```json
{
 "code": 200,
 "msg": null,
 "data": {
  "total": 16,
  "page": 1,
  "page_size": 10,
  "records": [
   {
    "id": 66,
    "prediction_type": "job_duration",
    "employment_success_rate": null,
    "predicted_salary_min": null,
    "predicted_salary_max": null,
    "predicted_salary_avg": null,
    "predicted_job_duration": "54",
    "model_used": "rnn_model_pth",
    "confidence_score": 0.85,
    "created_at": "2025-08-27 15:24:06"
   },
  ]
 }
}
```

### 8. 预测历史详情

**接口描述**: 获取指定预测记录的详细信息

**路由**: `GET /api/predict/history/<int:record_id>/`

**请求参数**:

- `record_id`: 预测记录ID（路径参数，整数）

**请求体**: 无

**返回体**:

```json
{
 "code": 200,
 "msg": null,
 "data": {
  "id": 58,
  "prediction_type": "employment_rate",
  "employment_success_rate": 95,
  "predicted_salary_min": null,
  "predicted_salary_max": null,
  "predicted_salary_avg": null,
  "predicted_job_duration": null,
  "model_used": "decision_tree_model",
  "model_version": "1.0",
  "confidence_score": 0.75,
  "input_data_snapshot": {
   "gender": "male",
   "hobby": "reading",
   "major": "计算机科学与技术",
   "graduation_year": "2025",
   "scores": {
    "political": 85,
    "major": 90,
    "english": 88,
    "physical": 75
   },
   "abilities": {
    "technical": 8,
    "communication": 7,
    "leadership": 6,
    "learning": 9,
    "problem_solving": 8
   }
  },
  "created_at": "2025-08-27 15:03:17"
 }
}
```

### 9. 综合预测分析 stats 部分

**接口描述**: 提供就业成功率、薪资和求职时长的综合预测分析

**路由**: `POST /api/predict/comprehensive/`

**请求参数**: 无

**请求体**:

```json
{
    "student_profile_id": 1,
    "target_industry": "互联网",
    "target_position": "软件工程师",
    "target_city": "北京",
    "expected_salary_min": 8000,
    "expected_salary_max": 15000,
    "job_search_intensity": "high",
    "location_flexibility": true,
    "salary_flexibility": true
}
```

**字段说明**: 结合上述各个预测接口的请求参数

**返回体**:

```json
{
    "code": 200,
    "message": "综合预测成功",
    "data": {
        "prediction_id": 4,
        "employment_prediction": {
            "probability": 0.85,
            "confidence": 0.92
        },
        "salary_prediction": {
            "min_salary": 9000,
            "max_salary": 14000,
            "avg_salary": 11500,
            "confidence": 0.88
        },
        "duration_prediction": {
            "expected_days": 45,
            "min_days": 30,
            "max_days": 60,
            "confidence": 0.80
        },
        "overall_assessment": {
            "success_level": "high",
            "risk_factors": [
                "市场竞争激烈",
                "技能要求不断提升"
            ],
            "advantages": [
                "专业对口",
                "学术表现优秀",
                "有实习经验"
            ]
        },
        "action_plan": [
            {
                "phase": "准备阶段",
                "duration": "1-2周",
                "tasks": [
                    "完善简历",
                    "准备作品集",
                    "练习面试技巧"
                ]
            },
            {
                "phase": "求职阶段",
                "duration": "4-6周",
                "tasks": [
                    "投递简历",
                    "参加面试",
                    "跟进反馈"
                ]
            }
        ],
        "predicted_at": "2024-01-15 12:15:00"
    }
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 注意事项

1. 所有接口都需要用户登录认证
2. 预测结果仅供参考，实际情况可能因市场变化而有所不同
3. 建议定期更新学生档案信息以获得更准确的预测结果
4. 预测模型会根据历史数据不断优化和更新
5. 请求频率限制：每个用户每分钟最多50次请求

## 更新日志

- **v1.0.0** (2024-01-15): 初始版本，包含基础预测功能
- 后续版本将根据用户反馈和需求进行功能扩展和优化
