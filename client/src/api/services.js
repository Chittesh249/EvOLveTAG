/**
 * API service functions. All return { success, data, message }-shaped responses.
 */
import client from "./client";

const getData = (res) => (res.data?.data !== undefined ? res.data.data : res.data);
const getSuccess = (res) => res.data?.success !== false;

// —— Auth ——
export const authApi = {
  login: (email, password) =>
    client.post("/auth/login", { email, password }).then((res) => ({
      success: getSuccess(res),
      data: res.data?.user ?? null,
      token: res.data?.access_token ?? null,
      message: res.data?.message,
    })),

  register: (email, password, role = "MEMBER") =>
    client.post("/auth/register", { email, password, role }).then((res) => ({
      success: getSuccess(res),
      message: res.data?.message,
    })),
};

// —— Profile (current user) ——
export const profileApi = {
  get: () =>
    client.get("/profile").then((res) => ({ success: true, data: getData(res) })),

  update: (payload) =>
    client.patch("/profile", payload).then((res) => ({ success: true, data: getData(res), message: res.data?.message })),
};

// —— Members (public) ——
export const membersApi = {
  list: () =>
    client.get("/members").then((res) => ({ success: true, data: getData(res) })),

  get: (id) =>
    client.get(`/members/${id}`).then((res) => ({ success: true, data: getData(res) })),
};

// —— Papers ——
export const papersApi = {
  list: () =>
    client.get("/papers").then((res) => ({ success: true, data: getData(res) })),

  upload: (formData) =>
    client.post("/papers", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => ({
      success: true,
      data: getData(res),
      message: res.data?.message,
    })),
};

// —— Newsletters ——
export const newslettersApi = {
  list: () =>
    client.get("/newsletters").then((res) => ({ success: true, data: getData(res) })),

  get: (slugOrId) =>
    client.get(`/newsletters/${slugOrId}`).then((res) => ({ success: true, data: getData(res) })),
};

// —— Site content (public home copy) ——
export const siteApi = {
  get: () =>
    client.get("/site").then((res) => ({ success: true, data: getData(res) })),
};

// —— Admin ——
export const adminApi = {
  users: {
    list: () =>
      client.get("/admin/users").then((res) => ({ success: true, data: getData(res) })),

    get: (id) =>
      client.get(`/admin/users/${id}`).then((res) => ({ success: true, data: getData(res) })),

    update: (id, payload) =>
      client.patch(`/admin/users/${id}`, payload).then((res) => ({ success: true, data: getData(res), message: res.data?.message })),
  },

  site: {
    get: () =>
      client.get("/admin/site").then((res) => ({ success: true, data: getData(res) })),

    update: (payload) =>
      client.put("/admin/site", payload).then((res) => ({ success: true, data: getData(res), message: res.data?.message })),
  },

  newsletters: {
    create: (payload) =>
      client.post("/newsletters", payload).then((res) => ({ success: true, data: getData(res), message: res.data?.message })),

    update: (id, payload) =>
      client.patch(`/newsletters/${id}`, payload).then((res) => ({ success: true, data: getData(res), message: res.data?.message })),

    delete: (id) =>
      client.delete(`/newsletters/${id}`).then((res) => ({ success: true, message: res.data?.message })),
  },
};
