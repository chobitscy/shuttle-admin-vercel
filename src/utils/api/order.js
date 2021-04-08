import {del, post, get} from "@/utils/request";

const API = '/orders/';

export const deleteOrder = (params) => del(API + 'delete', params);

export const updateOrder = (params) => post(API + 'update', params);

export const findAllOrder = (pageNo, pageSize) => get(API + 'findAll?' + 'pageNo=' + pageNo + '&pageSize=' + pageSize);

export const findByReceive = (pageNo, pageSize) => get(API + 'findByReceive?' + 'pageNo=' + pageNo + '&pageSize=' + pageSize);

export const findByCompleted = (pageNo, pageSize) => get(API + 'findByCompleted?' + 'pageNo=' + pageNo + '&pageSize=' + pageSize);

export const findByPresent= (pageNo, pageSize) => get(API + 'findByPresent?' + 'pageNo=' + pageNo + '&pageSize=' + pageSize);