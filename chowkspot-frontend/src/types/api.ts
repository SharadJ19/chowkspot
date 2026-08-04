// Generic API Response wrappers ({ success, data, errors })

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiErrorDetail[];
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  database: 'connected' | 'disconnected';
  uptime?: number;
  timestamp?: string;
  error?: string;
}
