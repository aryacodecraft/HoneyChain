const API_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error ||
      "Request failed"
    );
  }

  return data;
}

export async function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function getMyHives() {
  return request("/hives");
}

export async function createHive(hiveData) {
  return request("/hives", {
    method: "POST",
    body: JSON.stringify(hiveData),
  });
}

export async function getSensorReadings(hiveId) {
  return request(`/hives/${hiveId}/sensors`);
}

export async function getLatestPrediction(hiveId) {
  return request(`/hives/${hiveId}/predictions/latest`);
}

export async function createHoneyBatch(batchData) {
  return request("/batches", {
    method: "POST",
    body: JSON.stringify(batchData),
  });
}

export async function getMyBatches() {
  return request("/batches/my");
}

export async function getHoneyPassport(batchId) {
  return request(`/consumer/batch/${batchId}`);
}