# hzsystem_predict API 文档

## 概述

`hzsystem_predict` 应用提供学生就业预测相关的API接口，包括学生档案管理、就业成功率预测、薪资预测、求职时长预测等功能。

## 基础信息

- **基础URL**: `/api/predict/`
- **认证方式**: Session认证（需要用户登录）
- **响应格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应
```json
{
    "code": 200,
    "message": "操作成功",
    "data": {}
}
```

### 失败响应
```json
{
    "code": 400,
    "message": "错误信息",
    "data": null
}
```

### 错误响应
```json
{
    "code": 500,
    "message": "服务器内部错误",
    "data": null
}
```

## API 接口列表

### 1. 创建学生档案

**接口描述**: 创建新的学生档案信息

**路由**: `POST /api/predict/profile/create/`

**请求参数**: 无

**请求体**:
```json
{
    "name": "张三",
    "gender": "male",
    "hobby": "reading",
    "major": "计算机科学与技术",
    "graduation_year": "2025",
    "political_score": 85,
    "major_score": 90,
    "english_score": 88,
    "physical_score": 75,
    "technical_skills": 8,
    "communication_skills": 7,
    "leadership_skills": 6,
    "learning_ability": 9,
    "problem_solving": 8
}
```

**字段说明**:
- `name`: 学生姓名（必填，字符串）
- `student_id`: 学号（必填，字符串）
- `major`: 专业（必填，字符串）
- `grade`: 年级（必填，字符串）
- `gpa`: 绩点（必填，浮点数，0-4.0）
- `gender`: 性别（必填，字符串，male/female）
- `age`: 年龄（必填，整数）
- `hometown`: 家乡（可选，字符串）
- `family_income`: 家庭收入水平（可选，字符串，low/middle/high）
- `internship_experience`: 实习经历数量（可选，整数）
- `project_experience`: 项目经历数量（可选，整数）
- `skill_certifications`: 技能证书（可选，字符串，逗号分隔）
- `english_level`: 英语水平（可选，字符串）
- `social_activities`: 社会活动参与次数（可选，整数）
- `academic_awards`: 学术奖项数量（可选，整数）

**返回体**:
```json
{
    "code": 200,
    "message": "学生档案创建成功",
    "data": {
        "id": 1,
        "name": "张三",
        "student_id": "2021001",
        "major": "计算机科学与技术",
        "grade": "2021",
        "gpa": 3.8,
        "created_at": "2024-01-15 10:30:00"
    }
}
```

### 2. 更新学生档案

**接口描述**: 更新已存在的学生档案信息

**路由**: `POST /api/predict/profile/update/<int:profile_id>/`

**请求参数**: 
- `profile_id`: 学生档案ID（路径参数，整数）

**请求体**: 同创建学生档案，所有字段均为可选

**返回体**:
```json
{
    "code": 200,
    "message": "学生档案更新成功",
    "data": {
        "id": 1,
        "name": "张三",
        "student_id": "2021001",
        "updated_at": "2024-01-15 11:30:00"
    }
}
```

### 3. 获取学生档案详情

**接口描述**: 获取指定学生的档案详细信息

**路由**: `GET /api/predict/profile/<int:profile_id>/`

**请求参数**: 
- `profile_id`: 学生档案ID（路径参数，整数）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "id": 1,
        "name": "张三",
        "student_id": "2021001",
        "major": "计算机科学与技术",
        "grade": "2021",
        "gpa": 3.8,
        "gender": "male",
        "age": 22,
        "hometown": "北京市",
        "family_income": "middle",
        "internship_experience": 2,
        "project_experience": 3,
        "skill_certifications": "Java,Python,MySQL",
        "english_level": "CET6",
        "social_activities": 1,
        "academic_awards": 2,
        "created_at": "2024-01-15 10:30:00",
        "updated_at": "2024-01-15 11:30:00"
    }
}
```

### 4. 就业成功率预测

**接口描述**: 基于学生档案信息预测就业成功率

**路由**: `POST /api/predict/employment/`

**请求参数**: 无

**请求体**:
```json
{
    "student_profile_id": 1,
    "target_industry": "互联网",
    "target_position": "软件工程师",
    "target_city": "北京",
    "expected_salary_min": 8000,
    "expected_salary_max": 15000
}
```

**字段说明**:
- `student_profile_id`: 学生档案ID（必填，整数）
- `target_industry`: 目标行业（可选，字符串）
- `target_position`: 目标职位（可选，字符串）
- `target_city`: 目标城市（可选，字符串）
- `expected_salary_min`: 期望薪资最低值（可选，整数）
- `expected_salary_max`: 期望薪资最高值（可选，整数）

**返回体**:
```json
{
	"code": 200,
	"msg": "预测完成",
	"data": {
		"record_id": 51,
		"employment_success_rate": 95,
		"confidence_score": 75,
		"prediction_time": "2025-08-27 14:56:17"
	}
}
```

### 5. 薪资预测

**接口描述**: 基于学生档案和目标职位预测薪资范围

**路由**: `POST /api/predict/salary/`

**请求参数**: 无

**请求体**:
```json
{
    "student_profile_id": 1,
    "target_industry": "互联网",
    "target_position": "软件工程师",
    "target_city": "北京",
    "experience_years": 0
}
```

**字段说明**:
- `student_profile_id`: 学生档案ID（必填，整数）
- `target_industry`: 目标行业（可选，字符串）
- `target_position`: 目标职位（可选，字符串）
- `target_city`: 目标城市（可选，字符串）
- `experience_years`: 工作经验年数（可选，整数，默认0）

**返回体**:
```json
{
	"code": 200,
	"msg": "薪资预测完成",
	"data": {
		"record_id": 52,
		"predicted_salary_min": 12672,
		"predicted_salary_max": 20592,
		"predicted_salary_avg": 15840,
		"salary_range": {
			"min": 12672,
			"max": 20592
		},
		"confidence_score": 0.75,
		"target_position": "",
		"target_city": "",
		"prediction_time": "2025-08-27 14:56:50"
	}
}
```

### 6. 求职时长预测

**接口描述**: 预测学生找到合适工作所需的时间

**路由**: `POST /api/predict/job-duration/`

**请求参数**: 无

**请求体**:
```json
{
    "student_profile_id": 1,
    "job_search_intensity": "high",
    "target_industry": "互联网",
    "target_position": "软件工程师",
    "location_flexibility": true,
    "salary_flexibility": true
}
```

**字段说明**:
- `student_profile_id`: 学生档案ID（必填，整数）
- `job_search_intensity`: 求职强度（可选，字符串，low/medium/high）
- `target_industry`: 目标行业（可选，字符串）
- `target_position`: 目标职位（可选，字符串）
- `location_flexibility`: 地点灵活性（可选，布尔值）
- `salary_flexibility`: 薪资灵活性（可选，布尔值）

**返回体**:
```json
{
    "code": 200,
    "message": "预测成功",
    "data": {
        "prediction_id": 3,
        "predicted_duration_days": 45,
        "duration_range": {
            "min_days": 30,
            "max_days": 60
        },
        "confidence_level": 0.80,
        "duration_factors": [
            {
                "factor": "求职强度",
                "impact": -0.20,
                "description": "高强度求职可显著缩短求职时间"
            },
            {
                "factor": "专业热门度",
                "impact": -0.15,
                "description": "计算机专业需求量大，求职相对容易"
            }
        ],
        "suggestions": [
            "保持当前的高强度求职状态",
            "可以适当扩大目标公司范围",
            "建议完善简历中的项目经历部分"
        ],
        "predicted_at": "2024-01-15 12:10:00"
    }
}
```

### 7. 预测历史列表

**接口描述**: 获取用户的预测历史记录列表

**路由**: `GET /api/predict/history/`

**请求参数**: 
- `page`: 页码（可选，整数，默认1）
- `page_size`: 每页数量（可选，整数，默认20）
- `prediction_type`: 预测类型筛选（可选，字符串，employment_rate/salary_prediction/job_duration/comprehensive）
- `start_date`: 开始日期（可选，日期字符串，格式：YYYY-MM-DD）
- `end_date`: 结束日期（可选，日期字符串，格式：YYYY-MM-DD）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "total": 25,
        "page": 1,
        "page_size": 20,
        "records": [
            {
                "id": 1,
                "prediction_type": "comprehensive",
                "prediction_type_display": "综合预测",
                "employment_success_rate": 85.5,
                "predicted_salary_min": 8000,
                "predicted_salary_max": 12000,
                "predicted_salary_avg": 10000,
                "predicted_job_search_days": 45,
                "model_used": "ensemble_model",
                "model_version": "2.1",
                "confidence_score": 0.892,
                "created_at": "2024-01-15 14:30:00"
            },
            {
                "id": 2,
                "prediction_type": "salary_prediction",
                "prediction_type_display": "薪资预测",
                "employment_success_rate": null,
                "predicted_salary_min": 6000,
                "predicted_salary_max": 9000,
                "predicted_salary_avg": 7500,
                "predicted_job_search_days": null,
                "model_used": "random_forest_model",
                "model_version": "1.5",
                "confidence_score": 0.756,
                "created_at": "2024-01-14 10:15:00"
            }
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
    "message": "获取成功",
    "data": {
        "id": 1,
        "prediction_type": "comprehensive",
        "prediction_type_display": "综合预测",
        "employment_success_rate": 85.5,
        "predicted_salary_min": 8000,
        "predicted_salary_max": 12000,
        "predicted_salary_avg": 10000,
        "predicted_job_search_days": 45,
        "model_used": "ensemble_model",
        "model_version": "2.1",
        "confidence_score": 0.892,
        "input_data_snapshot": {
            "profile_data": {
                "gender": "male",
                "major": "计算机科学与技术",
                "graduation_year": "2024",
                "scores": {
                    "political": 85,
                    "major": 88,
                    "english": 82,
                    "physical": 90
                },
                "abilities": {
                    "technical": 8,
                    "communication": 7,
                    "leadership": 6,
                    "learning": 8,
                    "problem_solving": 7
                }
            },
            "target_params": {
                "position": "软件工程师",
                "city": "北京",
                "industry": "互联网",
                "job_search_intensity": "high"
            }
        },
        "created_at": "2024-01-15 14:30:00"
    }
}
```

### 9. 综合预测分析

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