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

export const INTERVIEW = {
    GENERATE: `/interviews/generate`,
    GET_LIST: `/interviews`,
    GET: (id:number) => `/interviews/${id}`,
    DELETE: (id:number) => `/interviews/${id}`,
    ANALYZE_ANSWER: (interviewId:number, questionId:number) => `/interviews/${interviewId}/questions/${questionId}/analyze`,
    SPEECH_TO_TEXT: `/interviews/speech-to-text`,
}


