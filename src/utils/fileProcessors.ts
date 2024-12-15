import { Schema, DataRecord } from '../types/schema';

export async function processCSV(file: File, schema: Schema): Promise<DataRecord[]> {
  const text = await file.text();
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',').map(v => v.trim());
      const data: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        const field = schema.fields.find(f => f.name === header);
        if (field) {
          const value = values[index];
          data[header] = convertValue(value, field.type);
        }
      });

      return {
        id: crypto.randomUUID(),
        schemaId: schema.id,
        data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
}

export async function processJSON(file: File, schema: Schema): Promise<DataRecord[]> {
  const text = await file.text();
  const jsonData = JSON.parse(text);
  
  if (!Array.isArray(jsonData)) {
    throw new Error('JSON file must contain an array of records');
  }

  return jsonData.map(item => {
    const data: Record<string, any> = {};
    
    schema.fields.forEach(field => {
      if (item[field.name] !== undefined) {
        data[field.name] = convertValue(item[field.name], field.type);
      }
    });

    return {
      id: crypto.randomUUID(),
      schemaId: schema.id,
      data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
}

function convertValue(value: string, type: 'string' | 'number' | 'boolean' | 'date'): any {
  switch (type) {
    case 'number':
      return Number(value);
    case 'boolean':
      return value.toLowerCase() === 'true';
    case 'date':
      return new Date(value);
    default:
      return value;
  }
}