# wqd_api

<!-- 创建routes -->

CREATE TABLE routes (
id INT AUTO_INCREMENT PRIMARY KEY, -- 自增的主键
path VARCHAR(255) NOT NULL, -- 路由路径
name VARCHAR(255) NOT NULL, -- 路由名称
label VARCHAR(255) NOT NULL, -- 菜单标签
folder VARCHAR(255) NOT NULL, -- 视图文件夹名称
file VARCHAR(255) NOT NULL, -- 视图文件名
component VARCHAR(255) NOT NULL, -- 组件路径
parent_id INT DEFAULT NULL, -- 父路由 ID，顶级菜单为 NULL
icon VARCHAR(255) DEFAULT NULL, --图标
FOREIGN KEY (parent_id) REFERENCES routes(id) -- 外键关联父级路由
);

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
role_id INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 管理员 (role_id = 1) 能访问所有路由
INSERT INTO role_routes (role_id, route_id) VALUES
(1, 1), -- /home
(1, 2), -- /welcome
(1, 3), -- /settings
(1, 4); -- /user

-- 普通用户 (role_id = 2) 只能访问 /home 和 /welcome
INSERT INTO role_routes (role_id, route_id) VALUES
(2, 1), -- /home
(2, 2); -- /welcome

-- 决定角色控制能看的路由，菜单
INSERT INTO role_routes (role_id, route_id) VALUES (1, 6);
-- DELETE FROM role_routes WHERE role_id = 1 AND route_id = 5;

-- 插入新的路由
INSERT INTO routes (path, name, label, folder, file, component, parent_id, icon)
VALUES ('/fe', 'FE', '面', 'fe', 'FeView', NULL, NULL , NULL);

-- 重新排一下编号
ALTER TABLE routes AUTO_INCREMENT = 1;

<!-- 不确定 -->

CREATE TABLE roles (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(50) NOT NULL
);

CREATE TABLE role_routes (
role_id INT,
route_id INT,
PRIMARY KEY (role_id, route_id),
FOREIGN KEY (role_id) REFERENCES roles(id),
FOREIGN KEY (route_id) REFERENCES routes(id)
);

INSERT INTO roles (id, name) VALUES (1, 'admin'), (2, 'user');

-- 角色表
INSERT INTO roles (id, name) VALUES
(1, '管理员'),
(2, '普通用户');

-- 路由表
INSERT INTO routes (id, path, name, label, folder, file, component, parent_id) VALUES
(1, '/home', 'Home', '主页', 'home', 'home', 'home', NULL),
(2, '/welcome', 'Welcome', '欢迎', 'welcome', 'welcome', 'welcome', 1),
(3, '/settings', 'Settings', '系统设置', 'settings', 'Settings', '@/views/settings/Settings.vue', 1),
(4, '/user', 'User', '用户管理', 'user', 'User', '@/views/user/User.vue', NULL);

-- 角色-路由关联表（管理员可访问所有路由）
INSERT INTO role_routes (role_id, route_id) VALUES
(1, 1), -- 管理员访问 /home
(1, 2), -- 管理员访问 /welcome
(1, 3), -- 管理员访问 /settings
(1, 4); -- 管理员访问 /user

-- 普通用户只能访问 /home 和 /welcome
INSERT INTO role_routes (role_id, route_id) VALUES
(2, 1),
(2, 2);

-- 管理员 (role_id = 1) 能访问所有路由
INSERT INTO role_routes (role_id, route_id) VALUES
(1, 1), -- /home
(1, 2), -- /welcome
(1, 3), -- /settings
(1, 4); -- /user

-- 普通用户 (role_id = 2) 只能访问 /home 和 /welcome
INSERT INTO role_routes (role_id, route_id) VALUES
(2, 1), -- /home
(2, 2); -- /welcome

//////

CREATE TABLE roles (
id INT AUTO_INCREMENT PRIMARY KEY, -- 角色 ID（唯一、自增）
name VARCHAR(255) NOT NULL UNIQUE -- 角色名称（唯一，如 "管理员"、"普通用户"）
);

INSERT INTO roles (name) VALUES
('管理员'),
('普通用户');

-- 管理员可以访问所有页面
INSERT INTO role_routes (role_id, route_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5);

-- 普通用户只能访问首页和欢迎页
INSERT INTO role_routes (role_id, route_id) VALUES
(2, 1), (2, 2);

CREATE TABLE products (
id INT AUTO_INCREMENT PRIMARY KEY COMMENT '编号',
name VARCHAR(255) NOT NULL COMMENT '产品名称',
category VARCHAR(100) NOT NULL COMMENT '分类',
price DECIMAL(10, 2) NOT NULL COMMENT '价格',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);

INSERT INTO products (name, category, price)
VALUES
('红酒杯', '玻璃制品', 19.99),
('雪人挂件', '节日装饰', 12.50),
('圣诞树顶星', '节日装饰', 15.75),
('迷你玻璃球', '玻璃制品', 9.90),
('水晶铃铛', '节日装饰', 14.20),
('圣诞袜子', '节日装饰', 11.50),
('玻璃小天使', '玻璃制品', 18.30),
('雪花吊坠', '节日装饰', 13.99),
('彩色玻璃球', '玻璃制品', 10.00),
('圣诞老人雕像', '节日装饰', 25.00),
('星星吊坠', '节日装饰', 10.50),
('透明玻璃蘑菇', '玻璃制品', 16.70),
('圣诞拐杖糖装饰', '节日装饰', 9.80),
('玻璃灯笼', '玻璃制品', 21.60),
('圣诞彩灯球', '节日装饰', 12.75),
('银色铃铛', '节日装饰', 10.90),
('彩绘玻璃星星', '玻璃制品', 17.99),
('圣诞花环', '节日装饰', 22.50),
('玻璃松果', '玻璃制品', 14.40),
('小雪人玻璃摆件', '玻璃制品', 13.30),
('圣诞礼品盒模型', '节日装饰', 15.60),
('玻璃树屋', '玻璃制品', 20.00),
('圣诞北极熊', '节日装饰', 18.80);
homes 首页  DashboardOutlined
Welcome 欢迎 welcome WelcomeView 1
Profile 个人资料 profile ProfileView UserOutlined
Settings 系统设置 settings SettingsView SettingOutlined
FE 面 fe FeView FundViewOutlined
Echarts 图表 echarts BarChartOutlined
Echarts 图表 resize echarts ResizeEcharts 7
Antd Antd antd AntDesignOutlined
合并表格 antd MergeTable 10
表格 antd TableView 10
Uploads 上传 CloudUploadOutlined
文件上传 uploads UploadsView 14
DownloadList 下载 uploads DownloadList 14
Waterfall 瀑布 echarts WaterfallView 7
权限 permission ScanOutlined
Permission 权限 permission PermissionView 18
Others 其他 AlignCenterOutlined
Drags 拖拽 others DragsView 20

<!-- 新增一列图表用于vue2 -->

ALTER TABLE `routes`
ADD COLUMN `iconv2` VARCHAR(255) DEFAULT NULL COMMENT '图标 V2 版本';
/home	homes	首页					DashboardOutlined	home
/welcome	Welcome	欢迎	welcome	WelcomeView		1		
/profile	Profile	个人资料	profile	ProfileView			UserOutlined	profile
/settings	Settings	系统设置	settings	SettingsView			SettingOutlined	setting
/fe	FE	面	fe	FeView			FundViewOutlined	shake
/echarts	Echarts	图表	echarts				BarChartOutlined	area-chart
/resizeEcharts	Echarts	图表resize	echarts	ResizeEcharts		7		
/antd	Antd	Antd	antd				AntDesignOutlined	table
/mergetable		合并表格	antd	MergeTable		10		
/table		表格	antd	TableView		10		tablet
/uploads	Uploads	上传					CloudUploadOutlined	upload
/uploadsSinggle		文件上传	uploads	UploadsView		14		
/downloadList	DownloadList	下载	uploads	DownloadList		14		download
/waterfall	Waterfall	瀑布	echarts	WaterfallView		7		bg-colors
/permissions		权限操作	permission				ScanOutlined	experiment
/permission	Permission	权限	permission	PermissionView		18		number
/others	Others	其他					AlignCenterOutlined	codepen-circle
/drags	Drags	拖拽	others	DragsView		20		drag
/virtualList	virtualList	虚拟列表	others	VirtualListView		20		unordered-list
/virtualformlist	VirtualFormList	虚拟	others	VirtualFormList		20		