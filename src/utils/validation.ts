import { Schema, DataRecord } from '../types/schema';

export function validateRecord(record: DataRecord, schema: Schema): string[] {
  const errors: string[] = [];

  schema.fields.forEach(field => {
    const value = record.data[field.name];

    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field.name} is required`);
    }

    if (value !== undefined && value !== null) {
      switch (field.type) {
        case 'number':
          if (isNaN(Number(value))) {
            errors.push(`${field.name} must be a number`);
          }
          break;
        case 'date':
          if (!(value instanceof Date) || isNaN(value.getTime())) {
            errors.push(`${field.name} must be a valid date`);
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`${field.name} must be a boolean`);
          }
          break;
      }
    }
  });

  return errors;
}