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
INSERT INTO routes (path, name, label, folder, file, component, parent_id)
VALUES ('/fe', 'FE', '面', 'fe', 'FeView', NULL, NULL);
