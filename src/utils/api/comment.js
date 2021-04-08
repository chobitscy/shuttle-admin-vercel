import {del, post,get} from "@/utils/request";

const API = '/major/comments/';

export const insertComment = (params) => post(API + 'insert', params);

export const deleteComment = (params) => del(API + 'delete', params);

export const updateComment= (params) => post(API + 'update', params);

export const findAllComment= (pageNo,pageSize) => get(API + 'findAll?pageNo=' + pageNo + '&pageSize=' + pageSize);