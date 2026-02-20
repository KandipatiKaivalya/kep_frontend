const BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  // ✅ RETURN PURE DATA (no nesting)
  return data;
};

const api = {

  // ✅ GET
  get: async (endpoint: string) => {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${path}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  // ✅ POST
  post: async (endpoint: string, body: any = null) => {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${path}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      ...(body && { body: JSON.stringify(body) })
    });

    return handleResponse(response);
  },

  // ✅ DELETE
  delete: async (endpoint: string) => {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${path}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  }
};

export default api;
