export interface Field {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
  description?: string;
}

export interface Schema {
  id: string;
  name: string;
  description: string;
  fields: Field[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DataRecord {
  id: string;
  schemaId: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}