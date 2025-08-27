# hzsystem_position API 文档

## 概述

`hzsystem_position` 应用提供职位管理和求职相关的API接口，包括职位浏览、职位申请、职位推荐、趋势分析等功能。

## 基础信息

- **基础URL**: `/api/position/`
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

### 1. 职位列表

**接口描述**: 获取职位列表，支持分页和筛选

**路由**: `GET /api/position/list/`

**请求参数**: 
- `page`: 页码（可选，整数，默认1）
- `page_size`: 每页数量（可选，整数，默认20）
- `industry`: 行业筛选（可选，字符串）
- `city`: 城市筛选（可选，字符串）
- `salary_min`: 最低薪资（可选，整数）
- `salary_max`: 最高薪资（可选，整数）
- `experience`: 经验要求（可选，字符串）
- `education`: 学历要求（可选，字符串）
- `keyword`: 关键词搜索（可选，字符串）
- `sort_by`: 排序方式（可选，字符串，salary/created_at/hot）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "total": 150,
        "page": 1,
        "page_size": 20,
        "positions": [
            {
                "id": 1,
                "title": "Java开发工程师",
                "company": {
                    "id": 1,
                    "name": "阿里巴巴",
                    "logo": "https://example.com/logo.png",
                    "industry": "互联网"
                },
                "salary_min": 15000,
                "salary_max": 25000,
                "city": "杭州",
                "experience_required": "1-3年",
                "education_required": "本科",
                "job_type": "全职",
                "tags": ["Java", "Spring", "MySQL"],
                "view_count": 1250,
                "application_count": 89,
                "created_at": "2024-01-15 09:00:00",
                "deadline": "2024-02-15",
                "is_hot": true,
                "is_urgent": false
            }
        ]
    }
}
```

### 2. 职位详情

**接口描述**: 获取指定职位的详细信息

**路由**: `GET /api/position/detail/<int:position_id>/`

**请求参数**: 
- `position_id`: 职位ID（路径参数，整数）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "id": 1,
        "title": "Java开发工程师",
        "description": "负责后端系统开发和维护...",
        "requirements": "1. 熟练掌握Java编程语言\n2. 熟悉Spring框架...",
        "responsibilities": "1. 参与系统架构设计\n2. 编写高质量代码...",
        "company": {
            "id": 1,
            "name": "阿里巴巴",
            "logo": "https://example.com/logo.png",
            "industry": "互联网",
            "scale": "10000人以上",
            "location": "杭州市西湖区",
            "description": "阿里巴巴集团...",
            "website": "https://www.alibaba.com"
        },
        "salary_min": 15000,
        "salary_max": 25000,
        "city": "杭州",
        "district": "西湖区",
        "address": "文三路969号",
        "experience_required": "1-3年",
        "education_required": "本科",
        "job_type": "全职",
        "work_mode": "现场办公",
        "benefits": ["五险一金", "年终奖", "带薪年假", "股票期权"],
        "tags": ["Java", "Spring", "MySQL", "Redis"],
        "view_count": 1250,
        "application_count": 89,
        "created_at": "2024-01-15 09:00:00",
        "updated_at": "2024-01-15 10:30:00",
        "deadline": "2024-02-15",
        "is_hot": true,
        "is_urgent": false,
        "is_applied": false,
        "contact_info": {
            "hr_name": "张小姐",
            "phone": "138****8888",
            "email": "hr@alibaba.com"
        }
    }
}
```

### 3. 申请职位

**接口描述**: 申请指定职位

**路由**: `POST /api/position/apply/<int:position_id>/`

**请求参数**: 
- `position_id`: 职位ID（路径参数，整数）

**请求体**:
```json
{
    "resume_file": "resume.pdf",
    "cover_letter": "尊敬的HR，我对贵公司的Java开发工程师职位非常感兴趣...",
    "expected_salary": 20000,
    "available_date": "2024-03-01",
    "additional_info": "我有相关项目经验..."
}
```

**字段说明**:
- `resume_file`: 简历文件（可选，字符串）
- `cover_letter`: 求职信（可选，字符串）
- `expected_salary`: 期望薪资（可选，整数）
- `available_date`: 可入职日期（可选，日期字符串）
- `additional_info`: 补充信息（可选，字符串）

**返回体**:
```json
{
    "code": 200,
    "message": "申请成功",
    "data": {
        "application_id": 1,
        "position_id": 1,
        "position_title": "Java开发工程师",
        "company_name": "阿里巴巴",
        "status": "pending",
        "applied_at": "2024-01-15 14:30:00"
    }
}
```

### 4. 我的申请记录

**接口描述**: 获取当前用户的职位申请记录

**路由**: `GET /api/position/applications/`

**请求参数**: 
- `page`: 页码（可选，整数，默认1）
- `page_size`: 每页数量（可选，整数，默认20）
- `status`: 申请状态筛选（可选，字符串，pending/reviewing/interviewed/accepted/rejected）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "total": 15,
        "page": 1,
        "page_size": 20,
        "applications": [
            {
                "id": 1,
                "position": {
                    "id": 1,
                    "title": "Java开发工程师",
                    "company_name": "阿里巴巴",
                    "salary_min": 15000,
                    "salary_max": 25000,
                    "city": "杭州"
                },
                "status": "reviewing",
                "status_display": "审核中",
                "applied_at": "2024-01-15 14:30:00",
                "updated_at": "2024-01-16 09:00:00",
                "expected_salary": 20000,
                "feedback": null
            }
        ]
    }
}
```

### 5. 申请详情

**接口描述**: 获取指定申请的详细信息

**路由**: `GET /api/position/application/<int:application_id>/`

**请求参数**: 
- `application_id`: 申请ID（路径参数，整数）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "id": 1,
        "position": {
            "id": 1,
            "title": "Java开发工程师",
            "company_name": "阿里巴巴",
            "salary_min": 15000,
            "salary_max": 25000,
            "city": "杭州"
        },
        "status": "reviewing",
        "status_display": "审核中",
        "resume_file": "resume.pdf",
        "cover_letter": "尊敬的HR，我对贵公司的Java开发工程师职位非常感兴趣...",
        "expected_salary": 20000,
        "available_date": "2024-03-01",
        "additional_info": "我有相关项目经验...",
        "applied_at": "2024-01-15 14:30:00",
        "updated_at": "2024-01-16 09:00:00",
        "feedback": null,
        "interview_info": null,
        "timeline": [
            {
                "status": "pending",
                "status_display": "待审核",
                "timestamp": "2024-01-15 14:30:00",
                "note": "申请已提交"
            },
            {
                "status": "reviewing",
                "status_display": "审核中",
                "timestamp": "2024-01-16 09:00:00",
                "note": "HR正在审核简历"
            }
        ]
    }
}
```

### 6. 取消申请

**接口描述**: 取消指定的职位申请

**路由**: `DELETE /api/position/application/<int:application_id>/cancel/`

**请求参数**: 
- `application_id`: 申请ID（路径参数，整数）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "申请已取消",
    "data": {
        "application_id": 1,
        "cancelled_at": "2024-01-16 15:00:00"
    }
}
```

### 7. 职位推荐

**接口描述**: 基于用户画像和偏好推荐合适的职位

**路由**: `GET /api/position/recommendations/`

**请求参数**: 
- `page`: 页码（可选，整数，默认1）
- `page_size`: 每页数量（可选，整数，默认10）
- `refresh`: 是否刷新推荐（可选，布尔值，默认false）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "total": 50,
        "page": 1,
        "page_size": 10,
        "recommendations": [
            {
                "position": {
                    "id": 1,
                    "title": "Java开发工程师",
                    "company_name": "阿里巴巴",
                    "salary_min": 15000,
                    "salary_max": 25000,
                    "city": "杭州",
                    "tags": ["Java", "Spring", "MySQL"]
                },
                "match_score": 0.92,
                "match_reasons": [
                    "专业高度匹配",
                    "薪资符合期望",
                    "技能要求匹配"
                ],
                "recommendation_type": "skill_match",
                "recommended_at": "2024-01-16 10:00:00"
            }
        ],
        "recommendation_summary": {
            "total_matches": 50,
            "high_match_count": 15,
            "medium_match_count": 25,
            "low_match_count": 10
        }
    }
}
```

### 8. 保存推荐

**接口描述**: 保存感兴趣的推荐职位

**路由**: `POST /api/position/save-recommendation/`

**请求参数**: 无

**请求体**:
```json
{
    "position_id": 1,
    "note": "这个职位很符合我的期望"
}
```

**字段说明**:
- `position_id`: 职位ID（必填，整数）
- `note`: 备注（可选，字符串）

**返回体**:
```json
{
    "code": 200,
    "message": "保存成功",
    "data": {
        "saved_id": 1,
        "position_id": 1,
        "saved_at": "2024-01-16 11:00:00"
    }
}
```

### 9. 职位分析

**接口描述**: 分析指定职位的竞争情况和匹配度

**路由**: `GET /api/position/analysis/<int:position_id>/`

**请求参数**: 
- `position_id`: 职位ID（路径参数，整数）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "分析成功",
    "data": {
        "position_id": 1,
        "competition_analysis": {
            "apply_count": 89,
            "total_views": 1250,
            "competition_level": "high",
            "similar_positions_count": 25,
            "avg_applications_per_position": 65
        },
        "match_analysis": {
            "overall_match_score": 0.85,
            "skill_match": 0.90,
            "experience_match": 0.80,
            "education_match": 1.0,
            "salary_match": 0.85,
            "location_match": 0.75
        },
        "requirements_breakdown": {
            "must_have_skills": ["Java", "Spring", "MySQL"],
            "nice_to_have_skills": ["Redis", "Docker", "Kubernetes"],
            "missing_skills": ["Docker"],
            "skill_gap_analysis": "建议学习Docker容器技术"
        },
        "success_probability": 0.78,
        "recommendations": [
            "补充Docker相关技能",
            "准备Spring框架相关面试题",
            "了解公司业务背景"
        ],
        "analyzed_at": "2024-01-16 12:00:00"
    }
}
```

### 10. 公司列表

**接口描述**: 获取公司列表信息

**路由**: `GET /api/position/companies/`

**请求参数**: 
- `page`: 页码（可选，整数，默认1）
- `page_size`: 每页数量（可选，整数，默认20）
- `industry`: 行业筛选（可选，字符串）
- `company_size`: 公司规模筛选（可选，字符串）
- `city`: 城市筛选（可选，字符串）
- `keyword`: 关键词搜索（可选，字符串）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "total": 200,
        "page": 1,
        "page_size": 20,
        "companies": [
            {
                "id": 1,
                "name": "阿里巴巴",
                "logo": "https://example.com/logo.png",
                "industry": "互联网",
                "company_size": "10000人以上",
                "location": "杭州市",
                "description": "阿里巴巴集团创立于1999年...",
                "website": "https://www.alibaba.com",
                "position_count": 156,
                "avg_salary": 18000,
                "rating": 4.5,
                "tags": ["互联网", "电商", "云计算"]
            }
        ]
    }
}
```

### 11. 公司详情

**接口描述**: 获取指定公司的详细信息

**路由**: `GET /api/position/company/<int:company_id>/`

**请求参数**: 
- `company_id`: 公司ID（路径参数，整数）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "id": 1,
        "name": "阿里巴巴",
        "logo": "https://example.com/logo.png",
        "industry": "互联网",
        "company_size": "10000人以上",
        "location": "杭州市西湖区",
        "address": "文三路969号",
        "description": "阿里巴巴集团创立于1999年，是全球领先的数字经济体...",
        "website": "https://www.alibaba.com",
        "founded_year": 1999,
        "ceo": "张勇",
        "business_scope": "电子商务、云计算、数字媒体与娱乐",
        "company_culture": "客户第一、团队合作、拥抱变化...",
        "benefits": ["五险一金", "年终奖", "股票期权", "免费三餐"],
        "active_positions": [
            {
                "id": 1,
                "title": "Java开发工程师",
                "salary_min": 15000,
                "salary_max": 25000,
                "city": "杭州",
                "created_at": "2024-01-15 09:00:00"
            }
        ],
        "statistics": {
            "position_count": 156,
            "avg_salary": 18000,
            "rating": 4.5,
            "review_count": 1250
        },
        "tags": ["互联网", "电商", "云计算", "人工智能"]
    }
}
```

### 12. 职位分类列表

**接口描述**: 获取职位分类信息

**路由**: `GET /api/position/categories/`

**请求参数**: 无

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "categories": [
            {
                "id": 1,
                "name": "技术开发",
                "subcategories": [
                    {
                        "id": 11,
                        "name": "后端开发",
                        "position_count": 1250
                    },
                    {
                        "id": 12,
                        "name": "前端开发",
                        "position_count": 890
                    }
                ],
                "total_positions": 3500
            },
            {
                "id": 2,
                "name": "产品运营",
                "subcategories": [
                    {
                        "id": 21,
                        "name": "产品经理",
                        "position_count": 450
                    }
                ],
                "total_positions": 800
            }
        ]
    }
}
```

### 13. 热门职位

**接口描述**: 获取当前热门职位列表

**路由**: `GET /api/position/hot/`

**请求参数**: 
- `limit`: 返回数量限制（可选，整数，默认10）
- `period`: 统计周期（可选，字符串，daily/weekly/monthly，默认weekly）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "period": "weekly",
        "hot_positions": [
            {
                "id": 1,
                "title": "Java开发工程师",
                "company_name": "阿里巴巴",
                "salary_min": 15000,
                "salary_max": 25000,
                "city": "杭州",
                "view_count": 1250,
                "application_count": 89,
                "heat_score": 95.8,
                "tags": ["Java", "Spring", "MySQL"]
            }
        ],
        "generated_at": "2024-01-16 13:00:00"
    }
}
```

### 14. 搜索建议

**接口描述**: 获取搜索关键词建议

**路由**: `GET /api/position/search-suggestions/`

**请求参数**: 
- `query`: 搜索关键词（必填，字符串）
- `type`: 建议类型（可选，字符串，position/company/skill，默认position）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "query": "java",
        "suggestions": [
            {
                "text": "Java开发工程师",
                "type": "position",
                "count": 1250
            },
            {
                "text": "Java后端开发",
                "type": "position",
                "count": 890
            },
            {
                "text": "Java架构师",
                "type": "position",
                "count": 156
            }
        ]
    }
}
```

## 趋势分析接口

### 15. 就业率趋势

**接口描述**: 获取就业率趋势分析数据

**路由**: `GET /api/position/employment-rate/`

**请求参数**: 
- `start_date`: 开始日期（可选，日期字符串，格式YYYY-MM-DD）
- `end_date`: 结束日期（可选，日期字符串，格式YYYY-MM-DD）
- `industry_id`: 行业ID（可选，整数）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "trend_data": [
            {
                "date": "2024-01-01",
                "employment_rate": 85.6,
                "total_graduates": 1000,
                "employed_count": 856,
                "industry_details": [
                    {
                        "industry": "互联网",
                        "employment_rate": 92.3,
                        "total_graduates": 300,
                        "employed_count": 277
                    }
                ]
            }
        ],
        "date_range": {
            "start_date": "2023-01-16",
            "end_date": "2024-01-16"
        }
    }
}
```

### 16. 薪资趋势

**接口描述**: 获取薪资趋势分析数据

**路由**: `GET /api/position/salary/`

**请求参数**: 
- `start_date`: 开始日期（可选，日期字符串）
- `end_date`: 结束日期（可选，日期字符串）
- `industry_id`: 行业ID（可选，整数）
- `position_type`: 职位类型（可选，字符串）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "salary_trend": [
            {
                "date": "2024-01-01",
                "average_salary": 12500.0,
                "salary_min": 8000.0,
                "salary_max": 25000.0,
                "industry_details": [
                    {
                        "industry": "互联网",
                        "avg_salary": 15000.0,
                        "salary_min": 10000.0,
                        "salary_max": 30000.0
                    }
                ]
            }
        ],
        "date_range": {
            "start_date": "2023-01-16",
            "end_date": "2024-01-16"
        }
    }
}
```

### 17. 热门职位排行

**接口描述**: 获取热门职位排行榜

**路由**: `GET /api/position/popular-ranking/`

**请求参数**: 
- `period`: 统计周期（可选，字符串，weekly/monthly/yearly，默认weekly）
- `industry_id`: 行业ID（可选，整数）
- `limit`: 返回数量（可选，整数，默认20）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "ranking": [
            {
                "rank": 1,
                "position_title": "Java开发工程师",
                "industry": "互联网",
                "view_count": 15000,
                "application_count": 1200,
                "avg_salary": 18000.0,
                "heat_index": 11860.0
            }
        ],
        "period": "weekly",
        "date_range": {
            "start_date": "2024-01-09",
            "end_date": "2024-01-16"
        },
        "total_positions": 20
    }
}
```

### 18. 行业分析报告

**接口描述**: 获取指定行业的分析报告

**路由**: `GET /api/position/industry-analysis/`

**请求参数**: 
- `industry_id`: 行业ID（必填，整数）
- `period`: 分析周期（可选，字符串，weekly/monthly/yearly，默认monthly）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "industry_info": {
            "id": 1,
            "name": "互联网",
            "description": "互联网及相关服务行业"
        },
        "statistics": {
            "total_graduates": 5000,
            "total_employed": 4600,
            "average_employment_rate": 92.0,
            "avg_salary": 18000.0
        },
        "trend_data": [
            {
                "date": "2024-01-01",
                "employment_rate": 92.3,
                "avg_salary": 18000.0,
                "total_graduates": 300,
                "employed_count": 277
            }
        ],
        "popular_positions": [
            {
                "position_title": "Java开发工程师",
            "view_count": 15000,
            "application_count": 1200,
            "avg_salary": 18000.0
            }
        ],
        "analysis_period": {
            "period": "monthly",
            "start_date": "2023-12-16",
            "end_date": "2024-01-16"
        }
    }
}
```

### 19. 统计概览

**接口描述**: 获取整体统计概览数据

**路由**: `GET /api/position/statistics/overview/`

**请求参数**: 无

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "employment_overview": {
            "total_graduates": 50000,
            "total_employed": 45000,
            "average_employment_rate": 90.0,
            "avg_salary": 15000.0
        },
        "industry_overview": {
            "total_industries": 15,
            "active_industries": 12
        },
        "position_overview": {
            "total_views": 500000,
            "total_applications": 25000,
            "unique_positions": 1500
        },
        "company_overview": {
            "total_companies": 800,
            "active_companies": 650
        },
        "statistics_period": {
            "start_date": "2023-12-16",
            "end_date": "2024-01-16"
        }
    }
}
```

### 20. 就业图表数据

**接口描述**: 获取用于图表展示的就业数据

**路由**: `GET /api/position/data/`

**请求参数**: 
- `type`: 图表类型（可选，字符串，employment_trend/salary_trend/industry_comparison，默认employment_trend）
- `period`: 统计周期（可选，字符串，weekly/monthly/yearly，默认monthly）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "chart_type": "employment_trend",
        "period": "monthly",
        "chart_data": {
            "labels": ["01-01", "01-02", "01-03"],
            "datasets": [
                {
                    "label": "就业率(%)",
                    "data": [85.6, 86.2, 87.1],
                    "type": "line"
                },
                {
                    "label": "毕业生总数",
                    "data": [1000, 1050, 1100],
                    "type": "bar"
                }
            ]
        },
        "date_range": {
            "start_date": "2023-12-16",
            "end_date": "2024-01-16"
        }
    }
}
```

### 21. 行业列表

**接口描述**: 获取行业列表及统计信息

**路由**: `GET /api/position/industries/`

**请求参数**: 
- `page`: 页码（可选，整数，默认1）
- `page_size`: 每页数量（可选，整数，默认20）
- `query`: 搜索关键词（可选，字符串）

**请求体**: 无

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "total": 15,
        "page": 1,
        "page_size": 20,
        "industries": [
            {
                "id": 1,
                "name": "互联网",
                "description": "互联网及相关服务行业",
                "created_at": "2024-01-01 00:00:00",
                "latest_employment_rate": 92.3,
                "latest_avg_salary": 18000.0,
                "latest_update": "2024-01-16"
            }
        ]
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
2. 分页参数中，page从1开始计数
3. 日期参数格式为YYYY-MM-DD
4. 薪资单位为人民币（元）
5. 请求频率限制：每个用户每分钟最多100次请求
6. 文件上传大小限制：简历文件不超过10MB
7. 部分统计数据可能存在缓存，更新频率为每小时一次

## 更新日志

- **v1.0.0** (2024-01-16): 初始版本，包含基础职位管理和趋势分析功能
- 后续版本将根据用户反馈和需求进行功能扩展和优化