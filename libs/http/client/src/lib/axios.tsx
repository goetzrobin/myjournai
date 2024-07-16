import axios, { AxiosResponse } from 'axios';
import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

const defaultOptions = {
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  }
};

const instance = axios.create(defaultOptions);
export const useAxios = () => instance;

export const AxiosInterceptor = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  useEffect(() => {
    const resInterceptor = (response: AxiosResponse<unknown>) => {
      return response;
    };
    const errInterceptor = async (error: any) => {
      if (error.response.status === 401 || error.response.status === 403) {
        await navigate({
          to: '/sign-in'
        });
      }

      return Promise.reject(error);
    };
    instance.interceptors.response.use(resInterceptor, errInterceptor);
  }, [navigate]);


  return children;
};

