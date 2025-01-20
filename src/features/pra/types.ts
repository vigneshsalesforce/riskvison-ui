// src/features/pra/types.ts
import { Entity, PaginatedResponse } from '../../types';

export interface Field {
    name: string;
    label: string;
    type: string;
    sequence: number;
    required?: boolean;
    options?: {
        static?: string[];
         dynamic?: {
            objectName: string;
            displayField: string;
            valueField: string;
        };
    };
     tooltip?: string;
    defaultValue?: any;
}

export interface Section {
    name: string;
    sequence: number;
    fields: Field[];
}

export interface Screen {
    name: string;
    sequence: number;
    sections: Section[];
}


export interface WizardObjectDefinition extends Entity {
  objectName:string,
  label:string,
  description?:string,
  screens: Screen[],
}
export type PropertyRiskAssessment = Entity;

export type PropertyRiskAssessmentPaginatedResponse = PaginatedResponse<PropertyRiskAssessment>;