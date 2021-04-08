import {del, get, post} from '@/utils/request'

const API = '/major/service/';

export const insertService = (params) => post(API + 'insert', params);

export const deleteService = (params) => del(API + 'delete', params);

export const updateService = (params) => post(API + 'update', params);

export const findAllService = (pageNo) => get(API + 'findAll?' + 'pageNo=' + pageNo);

