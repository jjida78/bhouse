import { ProjectRecord, ConnectedSheet } from '../types';

const STORAGE_KEY_RECORDS = 'bhouse_project_records_v2';
const STORAGE_KEY_CONNECTED_SHEET = 'bhouse_connected_sheet_v2';

export const SHEET_TAB_NAME = 'B.house Projects';

export const SHEET_COLUMNS = [
  '프로젝트 주제',
  '자재 리스트',
  '견적서',
  '실행가',
  '현장 사진',
  '저장일시',
];

// TSV for 1st row of new Google Sheet
export const SHEET_HEADERS_TSV = SHEET_COLUMNS.join('\t');

// Helper to check if a URL is a dummy placeholder that causes Google 404
export function isDummySheetUrl(url?: string | null): boolean {
  if (!url) return true;
  return (
    url.includes('1Bhouse_Interior_Projects_Archive') ||
    url.includes('bhouse-projects') ||
    url.includes('example.com')
  );
}

// Helper to extract Google Sheet ID or validate format
export function isValidGoogleSheetUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('docs.google.com/spreadsheets/d/') && !isDummySheetUrl(url);
}

// Retrieve connected sheet from storage (filtering out invalid dummy URLs)
export function getConnectedSheet(): ConnectedSheet | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONNECTED_SHEET);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.url && isValidGoogleSheetUrl(parsed.url)) {
        return parsed;
      } else {
        // Clean up legacy dummy URL to prevent 404 error
        localStorage.removeItem(STORAGE_KEY_CONNECTED_SHEET);
      }
    }
  } catch (e) {
    console.warn('Failed to load connected sheet info', e);
  }
  return null;
}

// Save connected sheet to storage
export function saveConnectedSheet(sheet: ConnectedSheet | null): void {
  try {
    if (!sheet || isDummySheetUrl(sheet.url)) {
      localStorage.removeItem(STORAGE_KEY_CONNECTED_SHEET);
    } else {
      localStorage.setItem(STORAGE_KEY_CONNECTED_SHEET, JSON.stringify(sheet));
    }
  } catch (e) {
    console.warn('Failed to save connected sheet info', e);
  }
}

// Load historical records
export function getSavedProjectRecords(): ProjectRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read records from localStorage', e);
  }
  return [];
}

// Append new project record continuously without overwriting
export function appendProjectRecord(record: ProjectRecord): ProjectRecord[] {
  try {
    const current = getSavedProjectRecords();
    // Prepend latest record so the newest is at the top of the list
    const updated = [record, ...current.filter((r) => r.id !== record.id)];
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Could not persist record to localStorage', e);
    return [record];
  }
}

// Formats record for Google Sheets row: | 프로젝트 주제 | 자재 리스트 | 견적서 | 실행가 | 현장 사진 | 저장일시 |
export function formatRecordForSheetRow(record: ProjectRecord): string[] {
  const photoText =
    record.photos.length > 0
      ? `${record.photos.length}장 (${record.photos.map((p) => p.name).join(', ')})`
      : '사진 없음';

  return [
    record.topic,
    record.materials || '-',
    record.estimate || '-',
    record.executionCost || '-',
    photoText,
    record.savedAt,
  ];
}

// Generates TSV text ready for 1-click Ctrl+V paste directly into Google Sheets
export function generateSheetTsvRow(record: ProjectRecord): string {
  const clean = (str: string) => str.replace(/\t/g, ' ').replace(/\r?\n/g, ' / ');
  const row = formatRecordForSheetRow(record).map(clean);
  return row.join('\t');
}

// Helper to construct a new Google Sheet URL with pre-filled title
export function createNewGoogleSheetUrl(): string {
  return `https://docs.google.com/spreadsheets/create?title=B.house%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EA%B4%80%EB%A6%AC%20%EB%8C%80%EC%9E%A5`;
}

// Generates and triggers download of CSV for full record history
export function downloadRecordsCsv(records: ProjectRecord[]): void {
  const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;

  const rows = [
    SHEET_COLUMNS.map(escapeCsv).join(','),
    ...records.map((rec) =>
      formatRecordForSheetRow(rec)
        .map((cell) => cell.replace(/\r?\n/g, ' / '))
        .map(escapeCsv)
        .join(',')
    ),
  ];

  // UTF-8 BOM for Korean Excel / Google Sheets import compatibility
  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Bhouse_프로젝트_관리대장_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
