export const Method = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    PATCH: 'patch',
    DELETE: 'delete',
} as const;

export type Method = typeof Method[keyof typeof Method];
