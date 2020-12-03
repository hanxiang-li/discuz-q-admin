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


