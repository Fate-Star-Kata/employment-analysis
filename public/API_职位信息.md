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
 "msg": null,
 "data": {
  "trend_data": [
   {
    "date": "2024-10",
    "employment_rate": 77.06,
    "total_graduates": 12260,
    "employed_count": 9447,
    "industry_details": [
     {
      "industry": "教育",
      "employment_rate": 79,
      "total_graduates": 1057,
      "employed_count": 707
     },
     {
      "industry": "教育",
      "employment_rate": 76,
      "total_graduates": 1097,
      "employed_count": 917
     },
     {
      "industry": "教育",
      "employment_rate": 94,
      "total_graduates": 1026,
      "employed_count": 786
     },
     {
      "industry": "教育",
      "employment_rate": 86.3,
      "total_graduates": 1166,
      "employed_count": 937
     },
     {
      "industry": "能源",
      "employment_rate": 88,
      "total_graduates": 1019,
      "employed_count": 775
     },
     {
      "industry": "能源",
      "employment_rate": 89.5,
      "total_graduates": 847,
      "employed_count": 915
     },
     {
      "industry": "能源",
      "employment_rate": 88.4,
      "total_graduates": 1198,
      "employed_count": 679
     },
     {
      "industry": "能源",
      "employment_rate": 92.8,
      "total_graduates": 841,
      "employed_count": 841
     },
     {
      "industry": "娱乐",
      "employment_rate": 83.9,
      "total_graduates": 1074,
      "employed_count": 663
     },
     {
      "industry": "娱乐",
      "employment_rate": 80.1,
      "total_graduates": 803,
      "employed_count": 910
     },
     {
      "industry": "娱乐",
      "employment_rate": 91.4,
      "total_graduates": 1039,
      "employed_count": 653
     },
     {
      "industry": "娱乐",
      "employment_rate": 94.5,
      "total_graduates": 1093,
      "employed_count": 664
     }
    ]
   },
   {
    "date": "2024-11",
    "employment_rate": 76.27,
    "total_graduates": 6312,
    "employed_count": 4814,
    "industry_details": [
     {
      "industry": "教育",
      "employment_rate": 79.5,
      "total_graduates": 1044,
      "employed_count": 940
     },
     {
      "industry": "教育",
      "employment_rate": 83.7,
      "total_graduates": 971,
      "employed_count": 664
     },
     {
      "industry": "能源",
      "employment_rate": 87,
      "total_graduates": 1104,
      "employed_count": 888
     },
     {
      "industry": "能源",
      "employment_rate": 78.3,
      "total_graduates": 849,
      "employed_count": 838
     },
     {
      "industry": "娱乐",
      "employment_rate": 93.4,
      "total_graduates": 1152,
      "employed_count": 704
     },
     {
      "industry": "娱乐",
      "employment_rate": 88.5,
      "total_graduates": 1192,
      "employed_count": 780
     }
    ]
   },
   {
    "date": "2024-12",
    "employment_rate": 76.59,
    "total_graduates": 6049,
    "employed_count": 4633,
    "industry_details": [
     {
      "industry": "教育",
      "employment_rate": 76.9,
      "total_graduates": 924,
      "employed_count": 622
     },
     {
      "industry": "教育",
      "employment_rate": 79.5,
      "total_graduates": 949,
      "employed_count": 620
     },
     {
      "industry": "能源",
      "employment_rate": 77.5,
      "total_graduates": 974,
      "employed_count": 972
     },
     {
      "industry": "能源",
      "employment_rate": 94.7,
      "total_graduates": 996,
      "employed_count": 835
     },
     {
      "industry": "娱乐",
      "employment_rate": 78.8,
      "total_graduates": 1188,
      "employed_count": 914
     },
     {
      "industry": "娱乐",
      "employment_rate": 85.8,
      "total_graduates": 1018,
      "employed_count": 670
     }
    ]
   },
   {
    "date": "2025-01",
    "employment_rate": 83.09,
    "total_graduates": 5605,
    "employed_count": 4657,
    "industry_details": [
     {
      "industry": "教育",
      "employment_rate": 94.5,
      "total_graduates": 918,
      "employed_count": 667
     },
     {
      "industry": "教育",
      "employment_rate": 91.2,
      "total_graduates": 1061,
      "employed_count": 787
     },
     {
      "industry": "能源",
      "employment_rate": 83.7,
      "total_graduates": 847,
      "employed_count": 612
     },
     {
      "industry": "能源",
      "employment_rate": 78.8,
      "total_graduates": 864,
      "employed_count": 688
     },
     {
      "industry": "娱乐",
      "employment_rate": 83.4,
      "total_graduates": 1110,
      "employed_count": 968
     },
     {
      "industry": "娱乐",
      "employment_rate": 91.3,
      "total_graduates": 805,
      "employed_count": 935
     }
    ]
   },
   {
    "date": "2025-02",
    "employment_rate": 77.73,
    "total_graduates": 6416,
    "employed_count": 4987,
    "industry_details": [
     {
      "industry": "教育",
      "employment_rate": 83.5,
      "total_graduates": 1162,
      "employed_count": 851
     },
     {
      "industry": "教育",
      "employment_rate": 89,
      "total_graduates": 1187,
      "employed_count": 771
     },
     {
      "industry": "能源",
      "employment_rate": 83.3,
      "total_graduates": 850,
      "employed_count": 867
     },
     {
      "industry": "能源",
      "employment_rate": 89.5,
      "total_graduates": 1038,
      "employed_count": 634
     },
     {
      "industry": "娱乐",
      "employment_rate": 85.7,
      "total_graduates": 1075,
      "employed_count": 881
     },
     {
      "industry": "娱乐",
      "employment_rate": 86,
      "total_graduates": 1104,
      "employed_count": 983
     }
    ]
   },
   {
    "date": "2025-03",
    "employment_rate": 75.34,
    "total_graduates": 6050,
    "employed_count": 4558,
    "industry_details": [
     {
      "industry": "教育",
      "employment_rate": 83.6,
      "total_graduates": 952,
      "employed_count": 963
     },
     {
      "industry": "教育",
      "employment_rate": 90.8,
      "total_graduates": 945,
      "employed_count": 822
     },
     {
      "industry": "能源",
      "employment_rate": 78,
      "total_graduates": 1037,
      "employed_count": 635
     },
     {
      "industry": "能源",
      "employment_rate": 90.1,
      "total_graduates": 1019,
      "employed_count": 613
     },
     {
      "industry": "娱乐",
      "employment_rate": 75.3,
      "total_graduates": 913,
      "employed_count": 849
     },
     {
      "industry": "娱乐",
      "employment_rate": 95,
      "total_graduates": 1184,
      "employed_count": 676
     }
    ]
   },
   {
    "date": "2025-04",
    "employment_rate": 70.83,
    "total_graduates": 5996,
    "employed_count": 4247,
    "industry_details": [
     {
      "industry": "教育",
      "employment_rate": 89.9,
      "total_graduates": 947,
      "employed_count": 729
     },
     {
      "industry": "教育",
      "employment_rate": 76.3,
      "total_graduates": 1145,
      "employed_count": 784
     },
     {
      "industry": "能源",
      "employment_rate": 76.2,
      "total_graduates": 933,
      "employed_count": 676
     },
     {
      "industry": "能源",
      "employment_rate": 82.1,
      "total_graduates": 1001,
      "employed_count": 797
     },
     {
      "industry": "娱乐",
      "employment_rate": 89.2,
      "total_graduates": 926,
      "employed_count": 652
     },
     {
      "industry": "娱乐",
      "employment_rate": 94,
      "total_graduates": 1044,
      "employed_count": 609
     }
    ]
   },
   {
    "date": "2025-05",
    "employment_rate": 84.6,
    "total_graduates": 5622,
    "employed_count": 4756,
    "industry_details": [
     {
      "industry": "教育",
      "employment_rate": 78,
      "total_graduates": 981,
      "employed_count": 824
     },
     {
      "industry": "教育",
      "employment_rate": 84.1,
      "total_graduates": 843,
      "employed_count": 963
     },
     {
      "industry": "能源",
      "employment_rate": 77.4,
      "total_graduates": 854,
      "employed_count": 792
     },
     {
      "industry": "能源",
      "employment_rate": 88.6,
      "total_graduates": 872,
      "employed_count": 633
     },
     {
      "industry": "娱乐",
      "employment_rate": 85.9,
      "total_graduates": 949,
      "employed_count": 708
     },
     {
      "industry": "娱乐",
      "employment_rate": 92.1,
      "total_graduates": 1123,
      "employed_count": 836
     }
    ]
   },
   {
    "date": "2025-06",
    "employment_rate": 79.65,
    "total_graduates": 5941,
    "employed_count": 4732,
    "industry_details": [
     {
      "industry": "教育",
      "employment_rate": 92.2,
      "total_graduates": 1134,
      "employed_count": 918
     },
     {
      "industry": "教育",
      "employment_rate": 94.7,
      "total_graduates": 928,
      "employed_count": 829
     },
     {
      "industry": "能源",
      "employment_rate": 85.1,
      "total_graduates": 1095,
      "employed_count": 922
     },
     {
      "industry": "能源",
      "employment_rate": 92.6,
      "total_graduates": 836,
      "employed_count": 752
     },
     {
      "industry": "娱乐",
      "employment_rate": 84.1,
      "total_graduates": 1019,
      "employed_count": 679
     },
     {
      "industry": "娱乐",
      "employment_rate": 86.7,
      "total_graduates": 929,
      "employed_count": 632
     }
    ]
   },
   {
    "date": "2025-07",
    "employment_rate": 82.97,
    "total_graduates": 5953,
    "employed_count": 4939,
    "industry_details": [
     {
      "industry": "教育",
      "employment_rate": 75.6,
      "total_graduates": 903,
      "employed_count": 836
     },
     {
      "industry": "教育",
      "employment_rate": 88.6,
      "total_graduates": 1041,
      "employed_count": 659
     },
     {
      "industry": "能源",
      "employment_rate": 86.4,
      "total_graduates": 1147,
      "employed_count": 684
     },
     {
      "industry": "能源",
      "employment_rate": 90.2,
      "total_graduates": 1155,
      "employed_count": 888
     },
     {
      "industry": "娱乐",
      "employment_rate": 82,
      "total_graduates": 855,
      "employed_count": 893
     },
     {
      "industry": "娱乐",
      "employment_rate": 94.9,
      "total_graduates": 852,
      "employed_count": 979
     }
    ]
   },
   {
    "date": "2025-08",
    "employment_rate": 88.73,
    "total_graduates": 5650,
    "employed_count": 5013,
    "industry_details": [
     {
      "industry": "教育",
      "employment_rate": 79,
      "total_graduates": 893,
      "employed_count": 787
     },
     {
      "industry": "教育",
      "employment_rate": 79.7,
      "total_graduates": 875,
      "employed_count": 834
     },
     {
      "industry": "能源",
      "employment_rate": 80,
      "total_graduates": 957,
      "employed_count": 691
     },
     {
      "industry": "能源",
      "employment_rate": 83.9,
      "total_graduates": 1123,
      "employed_count": 838
     },
     {
      "industry": "娱乐",
      "employment_rate": 87.1,
      "total_graduates": 864,
      "employed_count": 954
     },
     {
      "industry": "娱乐",
      "employment_rate": 78.6,
      "total_graduates": 938,
      "employed_count": 909
     }
    ]
   }
  ],
  "date_range": {
   "start_date": "2024-08-27",
   "end_date": "2025-08-27"
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
 "msg": null,
 "data": {
  "salary_trend": [
   {
    "date": "2024-10",
    "avg_salary": 12091,
    "salary_min": 0,
    "salary_max": 0,
    "industry_details": [
     {
      "industry": "教育",
      "avg_salary": 9181,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 13390,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 14105,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 12872,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 13124,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 14527,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 14340,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 9390,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 10292,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 13283,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 11305,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 9283,
      "salary_min": 0,
      "salary_max": 0
     }
    ]
   },
   {
    "date": "2024-11",
    "avg_salary": 11618.67,
    "salary_min": 0,
    "salary_max": 0,
    "industry_details": [
     {
      "industry": "教育",
      "avg_salary": 10149,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 11637,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 12636,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 8644,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 12001,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 14645,
      "salary_min": 0,
      "salary_max": 0
     }
    ]
   },
   {
    "date": "2024-12",
    "avg_salary": 12556.67,
    "salary_min": 0,
    "salary_max": 0,
    "industry_details": [
     {
      "industry": "教育",
      "avg_salary": 14340,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 14178,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 12252,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 10983,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 13719,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 9868,
      "salary_min": 0,
      "salary_max": 0
     }
    ]
   },
   {
    "date": "2025-01",
    "avg_salary": 11910.17,
    "salary_min": 0,
    "salary_max": 0,
    "industry_details": [
     {
      "industry": "教育",
      "avg_salary": 14566,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 13165,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 13313,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 9239,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 13150,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 8028,
      "salary_min": 0,
      "salary_max": 0
     }
    ]
   },
   {
    "date": "2025-02",
    "avg_salary": 11037.83,
    "salary_min": 0,
    "salary_max": 0,
    "industry_details": [
     {
      "industry": "教育",
      "avg_salary": 11188,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 8687,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 9645,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 12095,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 13731,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 10881,
      "salary_min": 0,
      "salary_max": 0
     }
    ]
   },
   {
    "date": "2025-03",
    "avg_salary": 13263.67,
    "salary_min": 0,
    "salary_max": 0,
    "industry_details": [
     {
      "industry": "教育",
      "avg_salary": 13613,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 13130,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 14853,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 12948,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 14279,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 10759,
      "salary_min": 0,
      "salary_max": 0
     }
    ]
   },
   {
    "date": "2025-04",
    "avg_salary": 10925.17,
    "salary_min": 0,
    "salary_max": 0,
    "industry_details": [
     {
      "industry": "教育",
      "avg_salary": 13882,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 10636,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 8901,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 10468,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 9725,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 11939,
      "salary_min": 0,
      "salary_max": 0
     }
    ]
   },
   {
    "date": "2025-05",
    "avg_salary": 11698.5,
    "salary_min": 0,
    "salary_max": 0,
    "industry_details": [
     {
      "industry": "教育",
      "avg_salary": 14675,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 9255,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 10391,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 11962,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 10460,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 13448,
      "salary_min": 0,
      "salary_max": 0
     }
    ]
   },
   {
    "date": "2025-06",
    "avg_salary": 11525.67,
    "salary_min": 0,
    "salary_max": 0,
    "industry_details": [
     {
      "industry": "教育",
      "avg_salary": 10198,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 11007,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 14400,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 8487,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 10249,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 14813,
      "salary_min": 0,
      "salary_max": 0
     }
    ]
   },
   {
    "date": "2025-07",
    "avg_salary": 12196.5,
    "salary_min": 0,
    "salary_max": 0,
    "industry_details": [
     {
      "industry": "教育",
      "avg_salary": 13367,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 11965,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 12346,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 12138,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 13846,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 9517,
      "salary_min": 0,
      "salary_max": 0
     }
    ]
   },
   {
    "date": "2025-08",
    "avg_salary": 11589.5,
    "salary_min": 0,
    "salary_max": 0,
    "industry_details": [
     {
      "industry": "教育",
      "avg_salary": 10599,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "教育",
      "avg_salary": 9129,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 12322,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "能源",
      "avg_salary": 12164,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 13642,
      "salary_min": 0,
      "salary_max": 0
     },
     {
      "industry": "娱乐",
      "avg_salary": 11681,
      "salary_min": 0,
      "salary_max": 0
     }
    ]
   }
  ],
  "date_range": {
   "start_date": "2024-08-27",
   "end_date": "2025-08-27"
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
 "msg": null,
 "data": {
  "ranking": [
   {
    "rank": 1,
    "position_title": "产品经理",
    "industry": "医疗",
    "total_views": 36821,
    "total_applications": 2285,
    "avg_salary": 14683.5,
    "heat_index": 26460.2
   },
   {
    "rank": 7,
    "position_title": "Python开发工程师",
    "industry": "教育",
    "total_views": 9548,
    "total_applications": 1933,
    "avg_salary": 12674,
    "heat_index": 7263.5
   },
  ],
  "period": "weekly",
  "date_range": {
   "start_date": "2025-08-20",
   "end_date": "2025-08-27"
  },
  "total_positions": 12
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
 "msg": null,
 "data": {
  "employment_overview": {
   "total_graduates": 71854,
   "total_employed": 56783,
   "average_employment_rate": 85.49,
   "avg_salary": 11875.36
  },
  "industry_overview": {
   "total_industries": 10,
   "active_industries": 3
  },
  "position_overview": {
   "total_views": 304363,
   "total_applications": 30973,
   "unique_positions": 300
  },
  "company_overview": {
   "total_companies": 30,
   "active_companies": 30
  },
  "statistics_period": {
   "start_date": "2025-07-28",
   "end_date": "2025-08-27"
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
 "msg": null,
 "data": {
  "chart_type": "employment_trend",
  "period": "monthly",
  "chart_data": {
   "labels": [
    "2025-01",
    "2025-02",
    "2025-03",
    "2025-04",
    "2025-05",
    "2025-06",
    "2025-07",
    "2025-08"
   ],
   "datasets": [
    {
     "label": "就业率(%)",
     "data": [
      87.15,
      86.17,
      85.47,
      84.62,
      84.35,
      89.23,
      86.28,
      81.38
     ],
     "type": "line"
    },
    {
     "label": "毕业生总数",
     "data": [
      5605,
      6416,
      6050,
      5996,
      5622,
      5941,
      5953,
      5650
     ],
     "type": "bar"
    }
   ]
  },
  "date_range": {
   "start_date": "2025-07-28",
   "end_date": "2025-08-27"
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
 "msg": null,
 "data": {
  "total": 10,
  "categories": [
   {
    "id": 2,
    "name": "互联网",
    "description": "互联网和软件开发行业",
    "position_count": 0,
    "sort_order": 0
   },
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
