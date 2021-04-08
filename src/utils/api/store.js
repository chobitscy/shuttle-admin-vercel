import {del, post, get} from "@/utils/request";

const API = '/major/store/';

export const insertStore = (params) => post(API + 'insert', params);

export const deleteStore = (params) => del(API + 'delete', params);

export const updateStore = (params) => post(API + 'update', params);

export const findAllStore = (pageNo, pageSize) => get(API + 'findAll?pageNo=' + pageNo + '&pageSize=' + pageSize);