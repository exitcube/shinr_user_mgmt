import axios, { type RawAxiosRequestHeaders } from "axios";


const BASE_URL = "https://jsonplaceholder.typicode.com";

interface GetRequestOptions {
  endpoint: string;
  query?: Record<string, any>;
  headers?: RawAxiosRequestHeaders;
}

interface PostPutRequestOptions {
  endpoint: string;
  body?: Record<string, any>;
  headers?: RawAxiosRequestHeaders;
}

interface DeleteRequestOptions {
  endpoint: string;
  headers?: RawAxiosRequestHeaders;
}

// ---------------- GET ----------------
export const getRequest = async ({ endpoint, query = {}, headers = {} }: GetRequestOptions): Promise<any> => {
  try {
    const api = axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
      headers: { "Content-Type": "application/json", ...headers },
    });

    const response = await api.request({
      method: "GET",
      url: endpoint,
      params: query,
    });

    return response.data;
  } catch (error: any) {
    console.error(`GET ${endpoint} failed:`, error.message);
    throw error;
  }
};

// ---------------- POST ----------------
export const postRequest = async ({ endpoint, body = {}, headers = {} }: PostPutRequestOptions): Promise<any> => {
  try {
    const api = axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
      headers: { "Content-Type": "application/json", ...headers },
    });

    const response = await api.request({
      method: "POST",
      url: endpoint,
      data: body,
    });

    return response.data;
  } catch (error: any) {
    console.error(`POST ${endpoint} failed:`, error.message);
    throw error;
  }
};

// ---------------- PUT ----------------
export const putRequest = async ({ endpoint, body = {}, headers = {} }: PostPutRequestOptions): Promise<any> => {
  try {
    const api = axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
      headers: { "Content-Type": "application/json", ...headers },
    });

    const response = await api.request({
      method: "PUT",
      url: endpoint,
      data: body,
    });

    return response.data;
  } catch (error: any) {
    console.error(`PUT ${endpoint} failed:`, error.message);
    throw error;
  }
};

// ---------------- Generic DELETE ----------------
export const deleteRequest = async ({ endpoint, headers = {} }: DeleteRequestOptions): Promise<any> => {
  try {
    const api = axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
      headers: { "Content-Type": "application/json", ...headers },
    });

    const response = await api.request({
      method: "DELETE",
      url: endpoint,
    });

    return response.data;
  } catch (error: any) {
    console.error(`DELETE ${endpoint} failed:`, error.message);
    throw error;
  }
};
