import {del, post,get} from "@/utils/request";

const API = '/major/category/';

export const insertCategory = (params) => post(API + 'insert', params);

export const deleteCategory = (params) => del(API + 'delete', params);

export const updateCategory = (params) => post(API + 'update', params);

export const findAllCategory = (pageNo,pageSize) => get(API + 'findAll?pageNo=' + pageNo + '&pageSize=' + pageSize);