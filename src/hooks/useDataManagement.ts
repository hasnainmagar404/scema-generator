import { useState } from 'react';
import { Schema, DataRecord } from '../types/schema';
import { processCSV, processJSON } from '../utils/fileProcessors';
import { validateRecord } from '../utils/validation';

export function useDataManagement(schema: Schema) {
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      setErrors([]);

      const newRecords = file.name.endsWith('.csv')
        ? await processCSV(file, schema)
        : await processJSON(file, schema);

      // Validate all records
      const allErrors: string[] = [];
      newRecords.forEach((record, index) => {
        const recordErrors = validateRecord(record, schema);
        if (recordErrors.length > 0) {
          allErrors.push(`Row ${index + 1}: ${recordErrors.join(', ')}`);
        }
      });

      if (allErrors.length > 0) {
        setErrors(allErrors);
        return;
      }

      setRecords(prevRecords => [...prevRecords, ...newRecords]);
    } catch (error) {
      setErrors([`Error processing file: ${error.message}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteRecord = (recordId: string) => {
    setRecords(prevRecords => prevRecords.filter(r => r.id !== recordId));
  };

  const updateRecord = (recordId: string, data: Record<string, any>) => {
    setRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === recordId
          ? { ...record, data, updatedAt: new Date() }
          : record
      )
    );
  };

  return {
    records,
    errors,
    isProcessing,
    processFile,
    deleteRecord,
    updateRecord,
  };
}