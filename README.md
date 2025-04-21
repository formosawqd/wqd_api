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

CREATE TABLE routes (
id INT PRIMARY KEY AUTO_INCREMENT,
path VARCHAR(255) NOT NULL,
name VARCHAR(255) NOT NULL,
label VARCHAR(255) NOT NULL,
folder VARCHAR(255) NOT NULL,
file VARCHAR(255) NOT NULL,
component VARCHAR(255) NOT NULL,
parent_id INT DEFAULT NULL -- parent_id 为 null 表示顶级路由
);

ALTER TABLE routes ADD UNIQUE (name);
ALTER TABLE routes ADD UNIQUE (path);

INSERT INTO routes (path, name, label, folder, file, component, parent_id) VALUES
('/home', 'Home', '首页', 'views/home', 'Home.vue', '@/views/home/Home.vue', NULL),
('/welcome', 'Welcome', '欢迎', 'views/welcome', 'Welcome.vue', '@/views/welcome/Welcome.vue', 1),
('/user', 'User', '用户管理', 'views/user', 'User.vue', '@/views/user/User.vue', NULL),
('/settings', 'Settings', '系统设置', 'views/settings', 'Settings.vue', '@/views/settings/Settings.vue', NULL);

CREATE TABLE role_routes (
role_id INT,
route_id INT,
PRIMARY KEY (role_id, route_id),
FOREIGN KEY (role_id) REFERENCES roles(id),
FOREIGN KEY (route_id) REFERENCES routes(id)
);

INSERT INTO roles (id, name) VALUES (1, 'admin'), (2, 'user');

INSERT INTO routes (id, path, name) VALUES
(1, '/dashboard', 'Dashboard'),
(2, '/profile', 'Profile'),
(3, '/admin', 'Admin Panel');

INSERT INTO role_routes (role_id, route_id) VALUES
(1, 1), (1, 2), (1, 3), -- 管理员可访问所有
(2, 1), (2, 2); -- 普通用户只能访问 dashboard 和 profile

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

CREATE TABLE routes (
id INT AUTO_INCREMENT PRIMARY KEY, -- 自增的主键
path VARCHAR(255) NOT NULL, -- 路由路径，如 "/home"
name VARCHAR(255) NOT NULL, -- 路由名称
label VARCHAR(255) NOT NULL, -- 菜单标签
folder VARCHAR(255) NOT NULL, -- 视图文件夹名称
file VARCHAR(255) NOT NULL, -- 视图文件名
component VARCHAR(255) NOT NULL, -- 组件路径
parent_id INT DEFAULT NULL, -- 父路由 ID，顶级菜单为 NULL
FOREIGN KEY (parent_id) REFERENCES routes(id) ON DELETE CASCADE
);

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY, -- 用户 ID（唯一、自增）
username VARCHAR(255) NOT NULL UNIQUE, -- 用户名（唯一）
password VARCHAR(255) NOT NULL, -- 加密后的密码
role_id INT NOT NULL, -- 用户的角色 ID
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE role_routes (
id INT AUTO_INCREMENT PRIMARY KEY, -- 自增主键
role_id INT NOT NULL, -- 角色 ID
route_id INT NOT NULL, -- 允许访问的路由 ID
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

INSERT INTO roles (name) VALUES
('管理员'),
('普通用户');

INSERT INTO routes (path, name, label, folder, file, component, parent_id) VALUES
('/home', 'Home', '主页', 'home', 'Home.vue', '@/views/home/Home.vue', NULL),
('/welcome', 'Welcome', '欢迎', 'welcome', 'Welcome.vue', '@/views/welcome/Welcome.vue', 1),
('/settings', 'Settings', '系统设置', 'settings', 'Settings.vue', '@/views/settings/Settings.vue', 1),
('/user', 'User', '用户管理', 'user', 'User.vue', '@/views/user/User.vue', NULL),
('/profile', 'Profile', '个人中心', 'profile', 'Profile.vue', '@/views/profile/Profile.vue', 3);

-- 管理员可以访问所有页面
INSERT INTO role_routes (role_id, route_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5);

-- 普通用户只能访问首页和欢迎页
INSERT INTO role_routes (role_id, route_id) VALUES
(2, 1), (2, 2);
