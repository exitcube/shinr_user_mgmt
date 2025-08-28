import axios, { type RawAxiosRequestHeaders, type AxiosRequestConfig } from "axios";

interface GetRequestOptions {
  endpoint: string;
  query?: Record<string, any>;
  headers?: RawAxiosRequestHeaders;
  baseURL?: string;
}

interface PostPutRequestOptions {
  endpoint: string;
  body?: Record<string, any>;
  headers?: RawAxiosRequestHeaders;
  baseURL?: string;
}

interface DeleteRequestOptions {
  endpoint: string;
  headers?: RawAxiosRequestHeaders;
  baseURL?: string;
}

// ---------------- GET ----------------
export async function getRequest({ endpoint, query = {}, headers = {}, baseURL }: GetRequestOptions): Promise<{ data: any; status: number; headers: Record<string, unknown> }> {
  try {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: endpoint,
      headers: { "Content-Type": "application/json", ...headers },
      params: query,
      ...(baseURL ? { baseURL } : {}),
    };

    const response = await axios.request(config);

    return {
      data: response.data,
      status: response.status,
      headers: response.headers as unknown as Record<string, unknown>,
    };
  } catch (error: any) {
    console.error(`GET ${endpoint} failed:`, error.message);
    throw error;
  }
}

// ---------------- POST ----------------
export async function postRequest({ endpoint, body = {}, headers = {}, baseURL }: PostPutRequestOptions): Promise<{ data: any; status: number; headers: Record<string, unknown> }> {
  try {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: endpoint,
      headers: { "Content-Type": "application/json", ...headers },
      data: body,
      ...(baseURL ? { baseURL } : {}),
    };

    const response = await axios.request(config);

    return {
      data: response.data,
      status: response.status,
      headers: response.headers as unknown as Record<string, unknown>,
    };
  } catch (error: any) {
    console.error(`POST ${endpoint} failed:`, error.message);
    throw error;
  }
}

// ---------------- PUT ----------------
export async function putRequest({ endpoint, body = {}, headers = {}, baseURL }: PostPutRequestOptions): Promise<{ data: any; status: number; headers: Record<string, unknown> }> {
  try {
    const config: AxiosRequestConfig = {
      method: "PUT",
      url: endpoint,
      headers: { "Content-Type": "application/json", ...headers },
      data: body,
      ...(baseURL ? { baseURL } : {}),
    };

    const response = await axios.request(config);

    return {
      data: response.data,
      status: response.status,
      headers: response.headers as unknown as Record<string, unknown>,
    };
  } catch (error: any) {
    console.error(`PUT ${endpoint} failed:`, error.message);
    throw error;
  }
}

// ---------------- DELETE ----------------
export async function deleteRequest({ endpoint, headers = {}, baseURL }: DeleteRequestOptions): Promise<{ data: any; status: number; headers: Record<string, unknown> }> {
  try {
    const config: AxiosRequestConfig = {
      method: "DELETE",
      url: endpoint,
      headers: { "Content-Type": "application/json", ...headers },
      ...(baseURL ? { baseURL } : {}),
    };

    const response = await axios.request(config);

    return {
      data: response.data,
      status: response.status,
      headers: response.headers as unknown as Record<string, unknown>,
    };
  } catch (error: any) {
    console.error(`DELETE ${endpoint} failed:`, error.message);
    throw error;
  }
}
