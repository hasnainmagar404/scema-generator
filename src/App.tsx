import React, { useState } from 'react';
import { Database } from 'lucide-react';
import SchemaForm from './components/SchemaForm';
import DataTable from './components/DataTable';
import FileUpload from './components/FileUpload';
import { useDataManagement } from './hooks/useDataManagement';
import type { Schema, DataRecord } from './types/schema';

function App() {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [showSchemaForm, setShowSchemaForm] = useState(false);

  const {
    records,
    errors,
    isProcessing,
    processFile,
    deleteRecord,
    updateRecord,
  } = useDataManagement(selectedSchema!);

  const handleSchemaSubmit = (schemaData: Omit<Schema, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSchema: Schema = {
      ...schemaData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSchemas([...schemas, newSchema]);
    setShowSchemaForm(false);
  };

  const handleEditRecord = (record: DataRecord) => {
    // TODO: Implement edit modal
    console.log('Editing record:', record.id);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                Schema Generator
              </h1>
            </div>
            <button
              onClick={() => setShowSchemaForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              New Schema
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {showSchemaForm ? (
          <div className="bg-white shadow rounded-lg p-6">
            <SchemaForm onSubmit={handleSchemaSubmit} />
          </div>
        ) : (
          <div className="space-y-6">
            {schemas.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {schemas.map((schema) => (
                  <div
                    key={schema.id}
                    className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedSchema(schema)}
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {schema.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {schema.description}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {schema.fields.length} fields
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No schemas
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new schema
                </p>
              </div>
            )}

            {selectedSchema && (
              <div className="bg-white shadow rounded-lg p-6 mt-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedSchema.name} Data
                  </h2>
                  {errors.length > 0 && (
                    <div className="mt-4 p-4 bg-red-50 rounded-md">
                      <h3 className="text-sm font-medium text-red-800">
                        Validation Errors:
                      </h3>
                      <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4">
                    <FileUpload
                      onUpload={processFile}
                      accept=".csv,.json"
                    />
                    {isProcessing && (
                      <p className="mt-2 text-sm text-gray-500">
                        Processing file...
                      </p>
                    )}
                  </div>
                </div>
                <DataTable
                  schema={selectedSchema}
                  records={records}
                  onEdit={handleEditRecord}
                  onDelete={deleteRecord}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;