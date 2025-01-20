// src/features/account/types.ts
import { Entity, PaginatedResponse } from '../../types';
export type Account = Entity;

export type AccountPaginatedResponse = PaginatedResponse<Account>;