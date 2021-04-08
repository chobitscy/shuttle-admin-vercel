import {get, post, del} from '@/utils/request'

const API = '/user/';

// 登录
export const login = (params) => post(API + 'login', params);

// 注册
export const register = (params) => post(API + 'register', params);

// 检查
export const check = () => get(API + 'check');

// 删除用户
export const deleteUser = (params) => del(API + 'delete', params);

// 更新用户资料
export const update = (params) => post(API + 'update', params);

// 查询全部用户
export const findAll = (pageNo, pageSize) => get(API + 'findAll?' + 'pageNo=' + pageNo + '&pageSize=' + pageSize);

// 搜索
export const search = (params) => post(API + 'search', params);

// 设置管理员
export const admin = (params) => post(API + 'admin', params);

// 根据id查询用户
export const findUserById = (params) => get(API + 'findById/' + params);