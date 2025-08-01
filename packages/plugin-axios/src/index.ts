import axios, {Axios, AxiosRequestConfig, AxiosResponse} from 'axios';
import {SagaLowerEffectsScope} from '@promise-saga/core';

export const withCancel = (fn: typeof axios.get) => (
  async function<T = any, R = AxiosResponse<T>, D = any>(
    this: SagaLowerEffectsScope,
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    this.throwIfCancelled();
    const result = await fn<T, R, D>(url, {
      signal: this.abortController.signal,
      ...config,
    });
    this.throwIfCancelled();
    return result;
  }
);

export type PluginConfig = {
  axiosInstance?: Axios,
};

export const createPlugin = (
  {
    axiosInstance = axios,
  }: PluginConfig = {}
) => ({
  lower: {
    get: withCancel(axiosInstance.get),
    delete: withCancel(axiosInstance.delete),
    head: withCancel(axiosInstance.head),
    options: withCancel(axiosInstance.options),
    post: withCancel(axiosInstance.post),
    put: withCancel(axiosInstance.put),
    patch: withCancel(axiosInstance.patch),
    postForm: withCancel(axiosInstance.postForm),
    putForm: withCancel(axiosInstance.putForm),
    patchForm: withCancel(axiosInstance.patchForm),
  },
});

export const plugin = createPlugin();
