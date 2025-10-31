type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = {
  async request<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new ApiError(
          response.status,
          response.statusText,
          errorText || `Request failed with status ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(
        error instanceof Error ? error.message : "Network request failed"
      );
    }
  },

  get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: "GET", headers });
  },

  post<T>(url: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: "POST", body, headers });
  },

  put<T>(url: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: "PUT", body, headers });
  },

  patch<T>(url: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: "PATCH", body, headers });
  },

  delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: "DELETE", headers });
  },
};

// Typed API endpoints
export const api = {
  // Admin endpoints
  admin: {
    tenants: {
      list: () => apiClient.get<any[]>("/api/admin/tenants"),
      create: (data: { slug: string; name: string }) =>
        apiClient.post<{ id: string }>("/api/admin/tenants", data),
    },
    plans: {
      list: () => apiClient.get<any[]>("/api/admin/plans"),
    },
    planFeatures: {
      list: () => apiClient.get<any[]>("/api/admin/plan-features"),
    },
  },

  // Clinical endpoints
  patients: {
    list: (search?: string) => {
      const url = search ? `/api/patients?q=${encodeURIComponent(search)}` : "/api/patients";
      return apiClient.get<any[]>(url);
    },
    create: (data: any) => apiClient.post<{ id: string }>("/api/patients", data),
  },

  providers: {
    list: () => apiClient.get<any[]>("/api/providers"),
  },

  appointments: {
    list: (patientId?: string) => {
      const url = patientId
        ? `/api/appointments?patientId=${patientId}`
        : "/api/appointments";
      return apiClient.get<any[]>(url);
    },
    create: (data: any) => apiClient.post<{ id: string }>("/api/appointments", data),
  },

  invoices: {
    list: () => apiClient.get<any[]>("/api/invoices"),
    create: (data: any) => apiClient.post<{ id: string }>("/api/invoices", data),
  },
};


