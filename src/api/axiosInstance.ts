// api.ts
import axios from 'axios';

// Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://controll.akaikumogo.uz',
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*'
  },
  timeout: 10000
});

// --- TypeScript tiplar ---

export type AddLogDto = {
  action: string;
  device: string;
  application: string;
  time: string; // ISO string
};

export type AddLogResponse = {
  _id: string;
  device: string;
  action: string;
  application: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Computer = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Log = {
  _id: string;
  device: string;
  action: string;
  application: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type FetchLogsParams = {
  device: string;
  application?: string;
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sortBy?: 'time' | 'device' | 'application' | 'action';
  order?: 'asc' | 'desc';
};

export type FetchLogsResponse = {
  data: Log[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export type Application = {
  name: string;
};

export type ApplicationsResponse = {
  data: Application[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export type ApplicationDetail = {
  name: string;
};

// --- API FUNCTIONS ---

export async function addLog(data: AddLogDto): Promise<AddLogResponse> {
  const { data: res } = await axiosInstance.post<AddLogResponse>(
    '/add-log',
    data
  );
  return res;
}

export async function fetchComputers(): Promise<Computer[]> {
  const { data } = await axiosInstance.get<Computer[]>('/computers');
  return data;
}

export async function fetchLogs(
  params: FetchLogsParams
): Promise<FetchLogsResponse> {
  const { device, ...queryParams } = params;
  const { data } = await axiosInstance.get<FetchLogsResponse>(
    `/computers/${device}/logs`,
    {
      params: queryParams
    }
  );
  return data;
}

export async function fetchApplications(
  page = 1,
  limit = 20
): Promise<ApplicationsResponse> {
  const { data } = await axiosInstance.get<ApplicationsResponse>(
    '/applications',
    {
      params: { page, limit }
    }
  );
  return data;
}

export async function fetchApplicationByName(
  name: string
): Promise<ApplicationDetail> {
  const { data } = await axiosInstance.get<ApplicationDetail>(
    `/applications/${encodeURIComponent(name)}`
  );
  return data;
}
