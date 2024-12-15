import React from 'react';
import type { Schema, DataRecord } from '../types/schema';
import { Edit2, Trash2 } from 'lucide-react';

interface DataTableProps {
  schema: Schema;
  records: DataRecord[];
  onEdit: (record: DataRecord) => void;
  onDelete: (recordId: string) => void;
}

export default function DataTable({ schema, records, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {schema.fields.map((field) => (
              <th
                key={field.name}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {field.name}
              </th>
            ))}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => (
            <tr key={record.id}>
              {schema.fields.map((field) => (
                <td key={field.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {String(record.data[field.name])}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(record)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(record.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}