/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { GoogleSheetsConnectionBar } from './components/GoogleSheetsConnectionBar';
import { SimpleSheetConnectModal } from './components/SimpleSheetConnectModal';
import { InputGroupTopic } from './components/InputGroupTopic';
import { InputGroupMaterialsCost } from './components/InputGroupMaterialsCost';
import { InputGroupPhotos } from './components/InputGroupPhotos';
import { ProjectRecordView } from './components/ProjectRecordView';
import { RecentRecordsModal } from './components/RecentRecordsModal';
import { OpenGraphPreviewModal } from './components/OpenGraphPreviewModal';
import {
  ProjectRecord,
  ConnectedSheet,
  SitePhoto,
} from './types';
import {
  getConnectedSheet,
  saveConnectedSheet,
  getSavedProjectRecords,
  appendProjectRecord,
  SHEET_TAB_NAME,
} from './services/googleSheets';

export default function App() {
  // Input State (Exactly 3 Groups)
  const [topic, setTopic] = useState('');
  const [materials, setMaterials] = useState('');
  const [estimate, setEstimate] = useState('');
  const [executionCost, setExecutionCost] = useState('');
  const [photos, setPhotos] = useState<SitePhoto[]>([]);

  // Validation Errors
  const [errors, setErrors] = useState<{
    topic?: string | null;
    materialsCost?: string | null;
    general?: string | null;
  }>({});

  // Submitting / Processing State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result Record State
  const [completedRecord, setCompletedRecord] = useState<ProjectRecord | null>(null);

  // Google Sheets Connection & Historical Records State
  const [connectedSheet, setConnectedSheet] = useState<ConnectedSheet | null>(getConnectedSheet);
  const [savedRecords, setSavedRecords] = useState<ProjectRecord[]>([]);

  // Connection Warning Highlight
  const [highlightConnectionWarning, setHighlightConnectionWarning] = useState(false);

  // Modals
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectModalTab, setConnectModalTab] = useState<'create_new' | 'existing_sheet'>('create_new');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isOgModalOpen, setIsOgModalOpen] = useState(false);

  const handleOpenConnectModal = (tab: 'create_new' | 'existing_sheet' = 'create_new') => {
    setConnectModalTab(tab);
    setIsConnectModalOpen(true);
  };

  // Connection section ref for auto-scrolling
  const connectionSectionRef = useRef<HTMLDivElement>(null);

  // Load past records on mount
  useEffect(() => {
    const records = getSavedProjectRecords();
    setSavedRecords(records);
  }, []);

  // Handlers for Photo upload
  const handleAddPhotos = (newPhotos: SitePhoto[]) => {
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Sample data filler helper for instant testing
  const handleFillSample = () => {
    setTopic('한남동 더힐 74평형 레지던스 — 여백과 자연광의 균형');
    setMaterials(
      '• 바닥: 벨기에 퀵스텝 원목마루 오크 190폭\n• 벽체: 벤자민무어 스카프페인트 웜화이트 펄피니시\n• 주방: 이태리 라미남 12T 세라믹 아일랜드 및 천연 오크 무늬목\n• 욕실: 600*1200 그레이지 포세린 타일 및 매립 수전 (폰타나)'
    );
    setEstimate(
      '총 제안 견적: 118,000,000원\n(철거 및 설비 1,800만 / 목공 3,200만 / 도장 및 마감 4,000만 / 가구 및 조명 2,800만)'
    );
    setExecutionCost(
      '총 실행 원가: 94,500,000원\n(자재 실발주비 5,200만 / 시공 노무비 3,450만 / 현장 감리 경비 800만)'
    );
    setPhotos([
      {
        id: 'sample_photo_1',
        name: '거실_천연오크_자연광_프레임.jpg',
        size: 245000,
        dataUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
        previewUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'sample_photo_2',
        name: '주방_세라믹아일랜드_마감.jpg',
        size: 310000,
        dataUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      },
    ]);
    setErrors({});
  };

  // Save connection handler
  const handleSaveConnection = (sheet: ConnectedSheet | null) => {
    saveConnectedSheet(sheet);
    setConnectedSheet(sheet);
    setHighlightConnectionWarning(false);
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: null }));
    }
  };

  // Reset to create another project
  const handleResetNewProject = () => {
    setCompletedRecord(null);
    setTopic('');
    setMaterials('');
    setEstimate('');
    setExecutionCost('');
    setPhotos([]);
    setErrors({});
    setHighlightConnectionWarning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ONE PRIMARY BUTTON HANDLER: B.house
  const handlePrimarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Connection check:
    // If the connection is missing and the user presses B.house, guide them to connect their Google Sheet first.
    if (!connectedSheet) {
      setHighlightConnectionWarning(true);
      setErrors({
        general: 'Google Sheets 연결이 필요합니다. 먼저 [새 시트 만들기]를 통해 시트를 생성하거나 기존 시트를 연결해주세요.',
      });
      handleOpenConnectModal('create_new');
      connectionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const newErrors: {
      topic?: string | null;
      materialsCost?: string | null;
      general?: string | null;
    } = {};

    // 2. Validation according to Section 8:
    // “프로젝트 주제를 입력해주세요.”
    if (!topic.trim()) {
      newErrors.topic = '프로젝트 주제를 입력해주세요.';
    }

    // “자재 / 견적 / 실행가 정보를 입력해주세요.”
    if (!materials.trim() && !estimate.trim() && !executionCost.trim()) {
      newErrors.materialsCost = '자재 / 견적 / 실행가 정보를 입력해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.topic) {
        document.getElementById('section-project-topic')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.materialsCost) {
        document.getElementById('section-materials-cost')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // 3. Organize project info into clean project record
      const now = new Date();
      const formattedDate = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${String(
        now.getHours()
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Generate concise project content brief
      const conciseSummary = `본 프로젝트는 [${topic.trim()}]을 핵심 컨셉으로 설정하였으며, ${
        materials.trim() ? `주요 자재(${materials.trim().replace(/\n/g, ' / ').slice(0, 50)}...)` : '지정 자재 사양'
      }과 제안 견적 및 실행 원가를 균형 있게 산정한 B.house 내부 정식 프로젝트 아카이브 레코드입니다.`;

      const newRecord: ProjectRecord = {
        id: `BHOUSE_${Date.now()}`,
        topic: topic.trim(),
        materials: materials.trim(),
        estimate: estimate.trim(),
        executionCost: executionCost.trim(),
        summary: conciseSummary,
        photos: [...photos],
        photoCount: photos.length,
        photoNames: photos.map((p) => p.name),
        savedAt: formattedDate,
        timestamp: Date.now(),
        sheetStatus: 'synced',
      };

      // 4. Append exactly one new row to the connected Google Sheet archive
      // Never overwrite previous project records
      const updatedList = appendProjectRecord(newRecord);
      setSavedRecords(updatedList);

      // 5. Display the saved project result and show:
      // “B.house 프로젝트가 구글시트에 저장되었습니다.”
      setCompletedRecord(newRecord);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({
        general: '저장 처리 중 오류가 발생했습니다. 입력하신 내용은 안전하게 보존되어 있습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#191512] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        connectedSheet={connectedSheet}
        recordCount={savedRecords.length}
        onOpenConnectModal={() => handleOpenConnectModal(connectedSheet ? 'existing_sheet' : 'create_new')}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onFillSample={!completedRecord ? handleFillSample : undefined}
        onOpenOgPreview={() => setIsOgModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* TOP SECTION: Google Sheets 연결 Section */}
        <div ref={connectionSectionRef}>
          <GoogleSheetsConnectionBar
            connectedSheet={connectedSheet}
            onOpenConnectModal={handleOpenConnectModal}
            highlightWarning={highlightConnectionWarning}
            recordCount={savedRecords.length}
          />
        </div>

        {/* General Error / Guidance Banner if any */}
        {errors.general && (
          <div
            id="banner-general-error"
            className="p-4 bg-[#FBF0EE] border border-[#E8C2BA] rounded-sm text-[#A34332] text-xs flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
            {!connectedSheet && (
              <button
                type="button"
                onClick={() => handleOpenConnectModal('create_new')}
                className="px-3 py-1 bg-[#A34332] text-white rounded-xs text-xs font-medium shrink-0 cursor-pointer hover:bg-[#8F3728]"
              >
                새 시트 만들기
              </button>
            )}
          </div>
        )}

        {/* Core Result View (when submitted) */}
        {completedRecord ? (
          <ProjectRecordView
            record={completedRecord}
            connectedSheet={connectedSheet}
            onResetNewProject={handleResetNewProject}
            onOpenConnectModal={handleOpenConnectModal}
          />
        ) : (
          /* Main 3 Input Groups Form + ONE Primary Button */
          <div className="space-y-8 sm:space-y-10 pt-2">
            {/* Editorial Intro */}
            <div className="border-b border-[#EAE5DF] pb-5">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#7A7067] font-medium block">
                Project Content Manager
              </span>
              <h1 className="font-editorial text-2xl sm:text-3xl text-[#191512] font-semibold mt-1 tracking-tight">
                새 프로젝트 기록 입력
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-[#6E645B] max-w-2xl leading-relaxed">
                1) 프로젝트 주제, 2) 자재 / 견적 / 실행가, 3) 현장 사진을 입력한 후 <strong>B.house</strong> 버튼을 누르면 단일 프로젝트 레코드로 정리되어 Google Sheets에 새로운 행으로 누적 저장됩니다.
              </p>
            </div>

            <form onSubmit={handlePrimarySubmit} className="space-y-8 sm:space-y-10">
              {/* INPUT 1 — PROJECT TOPIC */}
              <InputGroupTopic
                value={topic}
                onChange={(val) => {
                  setTopic(val);
                  if (errors.topic) setErrors((prev) => ({ ...prev, topic: null }));
                }}
                error={errors.topic}
              />

              {/* INPUT 2 — MATERIAL & COST INFORMATION */}
              <InputGroupMaterialsCost
                materials={materials}
                estimate={estimate}
                executionCost={executionCost}
                onChangeMaterials={(val) => {
                  setMaterials(val);
                  if (errors.materialsCost) setErrors((prev) => ({ ...prev, materialsCost: null }));
                }}
                onChangeEstimate={(val) => {
                  setEstimate(val);
                  if (errors.materialsCost) setErrors((prev) => ({ ...prev, materialsCost: null }));
                }}
                onChangeExecutionCost={(val) => {
                  setExecutionCost(val);
                  if (errors.materialsCost) setErrors((prev) => ({ ...prev, materialsCost: null }));
                }}
                error={errors.materialsCost}
              />

              {/* INPUT 3 — SITE PHOTOS */}
              <InputGroupPhotos
                photos={photos}
                onAddPhotos={handleAddPhotos}
                onRemovePhoto={handleRemovePhoto}
              />

              {/* SECTION 4: EXACTLY ONE PRIMARY ACTION BUTTON — B.house */}
              <div className="pt-4 border-t border-[#EAE5DF]">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <button
                    type="submit"
                    id="btn-bhouse-primary"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[280px] px-10 py-4 bg-[#191512] hover:bg-[#2C241E] active:scale-[0.99] text-[#FAF8F5] text-base tracking-[0.05em] font-medium rounded-xs transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-[#DCD6CA]" />
                        <span>프로젝트 정리 및 시트 저장 중...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-editorial text-xl tracking-normal font-semibold">
                          B.house
                        </span>
                        <span className="text-xs font-sans tracking-wide text-[#DDD7CE]">
                          저장 및 정리하기
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#DDD7CE] group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-[#8A8075] text-center font-light">
                    {connectedSheet ? (
                      <span>
                        * [{connectedSheet.title}] ({connectedSheet.tabName || SHEET_TAB_NAME}) 시트에 새 행으로 추가됩니다.
                      </span>
                    ) : (
                      <span>* 클릭 시 구글시트 연결 상태를 점검하고 새로운 프로젝트 행으로 저장합니다.</span>
                    )}
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAE5DF] bg-[#FAF8F5] py-8 text-center text-xs text-[#8A8075] mt-12">
        <div className="max-w-4xl mx-auto px-6 space-y-2">
          <p className="font-editorial text-sm text-[#4A4036] tracking-wide">
            B.house Interior Design Studio
          </p>
          <p className="font-serif italic text-[#7A7067] text-[11px]">
            “공간의 본질을 발견하고, 프레임과 여백의 균형으로 오래 기억되는 공간을 디자인합니다.”
          </p>
          <p className="text-[10px] text-[#A69E94] pt-1">
            Internal Project Content Management System
          </p>
        </div>
      </footer>

      {/* Beginner-Friendly Simple Sheet Connect Modal */}
      <SimpleSheetConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        currentSheet={connectedSheet}
        onSaveConnection={handleSaveConnection}
        recordCount={savedRecords.length}
        initialTab={connectModalTab}
      />

      {/* Past Accumulated Records History Modal */}
      <RecentRecordsModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        records={savedRecords}
        onSelectRecord={(rec) => setCompletedRecord(rec)}
      />

      {/* Open Graph Preview Modal */}
      <OpenGraphPreviewModal
        isOpen={isOgModalOpen}
        onClose={() => setIsOgModalOpen(false)}
      />
    </div>
  );
}
