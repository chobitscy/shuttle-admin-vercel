import {del, post, get} from "@/utils/request";

const API = '/major/poster/';

export const insertAds = (params) => post(API + 'insert', params);

export const deleteAds = (params) => del(API + 'delete', params);

export const updateAds = (params) => post(API + 'update', params);

export const findAllAds = () => get(API + 'findAll');