export const AUTH = {
    REGISTER: `/auth/register`,
    LOGIN: `/auth/login`,
    REFRESH_TOKEN: `/auth/refresh`,
    LOGOUT: `/auth/logout`,
}

export const USER = {
    GET_CURRENT: `/users/me`,
    UPDATE_CURRENT: `/users/me`,
    GET: (id:number) => `/users/${id}`,
    UPDATE: (id:number) => `/users/${id}`,
    DELETE: (id:number) => `/users/${id}`,
    GET_LIST: `/users`,
    DISABLE: (id:number) => `/users/${id}/disable`,
    ENABLE: (id:number) => `/users/${id}/enable`,
}

export const CV = {
    UPLOAD: `/cv/upload`,
    GET_LIST : `/cv/list`,
    GET: (id:number) => `/cv/${id}`,
    ANALYZE: (id:number) => `/cv/${id}/analyze`,
}

