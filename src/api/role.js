import request from "@/router/axios";

// 获取用户角色
export const queryUserRoleList = () => request({
	url: `/api/groups`,
	method: 'get',
})

export const queryUserRoleInfo = (id) => request({
	url: `/api/groups/${id}?include=permission,categoryPermissions`,
	method: 'get',
})

// 修改用户角色权限
export const updateUserRolePermission = (data) => request({
	url: `/api/permission`,
	method: 'post',
	data
})

// 修改用户组 - 批量
export const updateUserGroups = (data) => request({
	url: `/api/groups`,
	method: 'PATCH',
	data
})

// 修改用户组 - 单个
export const updateUserOneGroups = (data) => request({
	url: `/api/groups/${data.id}`,
	method: 'PATCH',
	data
})

