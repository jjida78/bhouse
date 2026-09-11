export interface SitePhoto {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
  previewUrl: string;
}

export interface ConnectedSheet {
  url: string;
  title: string;
  tabName: string; // 'B.house Projects'
  connectedAt: string;
}

export interface ProjectFormData {
  topic: string;
  materials: string;
  estimate: string;
  executionCost: string;
  photos: SitePhoto[];
}

export interface ProjectRecord {
  id: string;
  topic: string;
  materials: string;
  estimate: string;
  executionCost: string;
  summary: string;
  photos: SitePhoto[];
  photoCount: number;
  photoNames: string[];
  savedAt: string;
  timestamp: number;
  sheetStatus: 'synced' | 'pending' | 'copied' | 'unconfigured';
}
