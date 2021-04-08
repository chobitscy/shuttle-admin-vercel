import {del, post, get} from "@/utils/request";

const API = '/major/product/';

export const insertProduct = (params) => post(API + 'insert', params);

export const deleteProduct = (params) => del(API + 'delete', params);

export const updateProduct = (params) => post(API + 'update', params);

export const findAllProduct = (pageNo, pageSize) => get(API + 'findAll?' + 'pageNo=' + pageNo + '&pageSize=' + pageSize);

export const findProductById = (params) => get(API + 'findById/' + params);