// src/types/index.ts
export interface Option {
    label: string;
    value: string;
}

export interface Validation {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}
export interface DynamicOption {
    objectName: string;
    displayField: string;
    valueField: string;
}

export interface Options {
  static?: string[];
  dynamic?: DynamicOption;
}

export interface Field {
    name: string;
    label: string;
    type: 'text' | 'email' | 'url' | 'phone' | 'number' | 'currency' | 'date' | 'datetime' | 'time' | 'dropdown' | 'checkbox' | 'textarea' | 'lookup' | 'file';
    required: boolean;
    options?: Options;
    validation?: Validation;
    isHidden?: boolean;
    isReadOnly?: boolean;
}


export interface Relationship {
    name: string;
    relatedObject: string;
    type: 'one-to-many' | 'many-to-many' | 'one-to-one';
    cascadeDelete: boolean;
}


export interface ObjectDefinition {
    name: string;
    label: string;
    description?: string;
    fields: Field[];
    relationships?: Relationship[];
}


export interface Pagination {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}

export type Entity = Record<string, any>;