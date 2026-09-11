import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink, Calendar, Layers } from 'lucide-react';
import { ProjectRecord } from '../types';
import { generateSheetTsvRow } from '../services/googleSheets';

interface RecentRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ProjectRecord[];
  onSelectRecord: (record: ProjectRecord) => void;
}

export const RecentRecordsModal: React.FC<RecentRecordsModalProps> = ({
  isOpen,
  onClose,
  records,
  onSelectRecord,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyRow = async (record: ProjectRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const tsv = generateSheetTsvRow(record);
      await navigator.clipboard.writeText(tsv);
      setCopiedId(record.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.warn('Failed to copy', err);
    }
  };

  const handleExportCsv = () => {
    if (records.length === 0) return;

    const headers = ['프로젝트 주제', '자재 리스트', '견적서', '실행가', '현장 사진', '저장일시'];
    const rows = records.map((r) => [
      `"${(r.topic || '').replace(/"/g, '""')}"`,
      `"${(r.materials || '').replace(/"/g, '""')}"`,
      `"${(r.estimate || '').replace(/"/g, '""')}"`,
      `"${(r.executionCost || '').replace(/"/g, '""')}"`,
      `"${r.photos.length}장"`,
      `"${r.savedAt}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `B.house_프로젝트_아카이브_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#191512]/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] border border-[#DCD6CA] rounded-sm shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EAE5DF] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#191512]">
              누적 프로젝트 아카이브
            </h3>
            <p className="text-xs text-[#7A7067]">
              기존에 정리되어 저장된 프로젝트 기록 목록 ({records.length}건)
            </p>
          </div>
          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#191512] border border-[#DCD6CA] rounded-xs cursor-pointer"
                title="전체 CSV 내보내기"
              >
                <Download className="w-3.5 h-3.5 text-[#5A5046]" />
                <span>CSV 다운로드</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-[#FAF8F5] rounded-xs text-[#7A7067] hover:text-[#191512] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-5 overflow-y-auto divide-y divide-[#F0EBE3] flex-1 space-y-2">
          {records.length === 0 ? (
            <div className="text-center py-12 text-[#8A8075] text-xs">
              아직 저장된 프로젝트 기록이 없습니다.
            </div>
          ) : (
            records.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectRecord(item);
                  onClose();
                }}
                className="pt-3 pb-3 hover:bg-[#FAF8F5] px-3 -mx-3 rounded-xs cursor-pointer transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1 max-w-[75%]">
                  <div className="flex items-center gap-2">
                    <span className="font-editorial text-sm font-semibold text-[#191512] group-hover:underline">
                      {item.topic}
                    </span>
                    <span className="text-[10px] bg-[#F2ECE4] px-1.5 py-0.5 rounded-xs text-[#5C524A]">
                      사진 {item.photos?.length || 0}장
                    </span>
                  </div>
                  <p className="text-xs text-[#6E645B] line-clamp-1">
                    자재: {item.materials || '-'}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[#8A8075]">
                    <span>{item.savedAt}</span>
                    <span>견적: {item.estimate || '-'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={(e) => handleCopyRow(item, e)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] border border-[#DCD6CA] hover:bg-[#FFFFFF] rounded-xs text-[#4A4036] cursor-pointer bg-[#FAF8F5]"
                    title="이 프로젝트 행 복사"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#3A6B48]" />
                        <span className="text-[#3A6B48]">복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#7A7067]" />
                        <span>시트 행 복사</span>
                      </>
                    )}
                  </button>
                  <span className="text-xs text-[#8A8075] group-hover:text-[#191512]">
                    상세보기 &rarr;
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#EAE5DF] text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-[#5A5046] hover:text-[#191512] cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
