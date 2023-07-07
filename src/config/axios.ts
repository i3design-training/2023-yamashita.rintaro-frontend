import axiosBase from 'axios';

const BASEURL = import.meta.env.VITE_BASE_URL as string;

export const apiClient = axiosBase.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
