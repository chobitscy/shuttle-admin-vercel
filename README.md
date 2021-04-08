# shuttle后台管理系统

## 依赖

| Description | Version|
|  :----: | :----: |
| Vue.js | 2.6.11|
| Element UI | 2.15.0 |
| Vue Router | 3.5.1 |
| Vuex | 3.6.2 |
| axios | 0.21.1 |

## 必要文件
请在根目录下创建 `.env.local` 配置环境变量
```sh
# 反向代理目标ip
target=
```

## 部署

```sh
# 克隆项目
git clone https://github.com/TouwaErioer/shuttle-admin.git

cd shuttle-admin

# 构建docker镜像
docker build . -t shuttle-admin

# 后台运行
docker run -d -p 8080:80 shuttle-admin
```
