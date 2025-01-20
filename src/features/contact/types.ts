// src/features/contact/types.ts
import { Entity, PaginatedResponse } from '../../types';
export type Contact = Entity;
export type ContactPaginatedResponse = PaginatedResponse<Contact>;