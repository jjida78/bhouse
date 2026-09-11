import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Printer,
  PlusCircle,
  ExternalLink,
  Table,
  X,
  Download,
} from 'lucide-react';
import { ProjectRecord, SitePhoto, ConnectedSheet } from '../types';
import {
  generateSheetTsvRow,
  SHEET_TAB_NAME,
  downloadRecordsCsv,
  getSavedProjectRecords,
} from '../services/googleSheets';

interface ProjectRecordViewProps {
  record: ProjectRecord;
  connectedSheet: ConnectedSheet | null;
  onResetNewProject: () => void;
  onOpenConnectModal: (tab?: 'create_new' | 'existing_sheet') => void;
}

export const ProjectRecordView: React.FC<ProjectRecordViewProps> = ({
  record,
  connectedSheet,
  onResetNewProject,
  onOpenConnectModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null);

  const handleCopySheetRow = async () => {
    try {
      const tsv = generateSheetTsvRow(record);
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Failed to copy to clipboard', err);
    }
  };

  const handleDownloadCsv = () => {
    const records = getSavedProjectRecords();
    downloadRecordsCsv(records.length > 0 ? records : [record]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="bhouse-project-record-container" className="space-y-6">
      {/* 1. Success Message Banner - Strictly follows user request */}
      <div
        id="banner-success-message"
        className="bg-[#FFFFFF] border border-[#D4CEBF] p-4 sm:p-5 rounded-sm shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EBF3ED] border border-[#CDE3D5] flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-[#2D6A4F]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#191512] tracking-tight">
              {connectedSheet
                ? 'B.house 프로젝트가 구글시트에 저장되었습니다.'
                : 'B.house 프로젝트가 성공적으로 저장되었습니다.'}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#6E645B] mt-0.5 leading-relaxed">
              {connectedSheet ? (
                <span>
                  연결된 기존 시트 <strong className="text-[#2C241E]">[{connectedSheet.title}]</strong>의{' '}
                  <strong className="text-[#2C241E] font-mono">{connectedSheet.tabName || SHEET_TAB_NAME}</strong> 탭에 새 행으로 성공적으로 추가되었습니다. (다음 프로젝트도 이 기존 시트에 계속 누적됩니다)
                </span>
              ) : (
                <span>
                  프로젝트가 성공적으로 정리되어 <strong>B.house 관리 대장</strong>에 안전하게 누적 보존되었습니다.
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">
          {connectedSheet?.url ? (
            <a
              href={connectedSheet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#191512] border border-[#DCD6CA] rounded-xs transition-colors"
            >
              <Table className="w-3.5 h-3.5 text-[#5A5046]" />
              <span>시트 열기</span>
              <ExternalLink className="w-3 h-3 text-[#7A7067]" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => window.open('https://sheets.new', '_blank')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#191512] border border-[#DCD6CA] rounded-xs transition-colors cursor-pointer"
              title="Google 새 시트 열기"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#5A5046]" />
              <span>새 구글시트 열기</span>
            </button>
          )}

          <button
            type="button"
            id="btn-copy-sheet-row"
            onClick={handleCopySheetRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#191512] border border-[#DCD6CA] rounded-xs transition-colors cursor-pointer"
            title="시트에 바로 붙여넣을 수 있는 1행 데이터 복사"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span className="text-[#2D6A4F] font-medium">행 복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#6E645B]" />
                <span>시트 행 복사</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="btn-download-csv"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#191512] border border-[#DCD6CA] rounded-xs transition-colors cursor-pointer"
            title="CSV 파일로 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-[#6E645B]" />
            <span className="hidden sm:inline">CSV 저장</span>
          </button>

          <button
            type="button"
            id="btn-print-record"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#191512] border border-[#DCD6CA] rounded-xs transition-colors cursor-pointer"
            title="문서 인쇄 또는 PDF 저장"
          >
            <Printer className="w-3.5 h-3.5 text-[#6E645B]" />
            <span className="hidden sm:inline">인쇄</span>
          </button>
        </div>
      </div>

      {/* 2. Editorial Project Record Paper */}
      <article
        id="bhouse-project-record"
        className="bg-[#FFFFFF] border border-[#E2DDD6] p-6 sm:p-10 rounded-sm shadow-sm space-y-8"
      >
        {/* Record Header */}
        <div className="border-b border-[#EAE5DF] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] tracking-[0.25em] uppercase font-sans text-[#7A7067] font-medium">
                B.house Project Record
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#191512] font-semibold mt-1 tracking-tight">
                {record.topic}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-[#8A8075] font-mono block">
                {record.savedAt}
              </span>
              <span className="text-[11px] text-[#7A7067] bg-[#FAF8F5] px-2 py-0.5 rounded-xs border border-[#EAE5DF] inline-block mt-1">
                기록 ID: {record.id.slice(0, 14)}
              </span>
            </div>
          </div>

          {/* Project Content Brief / Summary */}
          {record.summary && (
            <div className="mt-4 p-3.5 bg-[#FAF8F5] border-l-2 border-[#191512] text-xs sm:text-sm text-[#4A4036] leading-relaxed">
              <span className="font-semibold text-[#191512] block mb-0.5">
                프로젝트 요약 브리프
              </span>
              {record.summary}
            </div>
          )}
        </div>

        {/* Section: 자재 리스트 */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#191512]" />
            <h3 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#5A5046]">
              자재 리스트 (Material Specification)
            </h3>
          </div>
          <div className="bg-[#FAF8F5] p-4 rounded-xs border border-[#EAE5DF] text-sm text-[#191512] whitespace-pre-wrap leading-relaxed">
            {record.materials || '등록된 자재 정보가 없습니다.'}
          </div>
        </div>

        {/* Section: 견적서 & 실행가 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E645B]" />
              <h3 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#5A5046]">
                견적서 (Proposal Estimate)
              </h3>
            </div>
            <div className="bg-[#FAF8F5] p-4 rounded-xs border border-[#EAE5DF] text-sm text-[#191512] whitespace-pre-wrap leading-relaxed min-h-[90px]">
              {record.estimate || '등록된 견적 정보가 없습니다.'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#191512]" />
              <h3 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#5A5046]">
                실행가 (Execution Cost)
              </h3>
            </div>
            <div className="bg-[#FAF8F5] p-4 rounded-xs border border-[#EAE5DF] text-sm text-[#191512] whitespace-pre-wrap leading-relaxed min-h-[90px]">
              {record.executionCost || '등록된 실행가 정보가 없습니다.'}
            </div>
          </div>
        </div>

        {/* Section: 현장 사진 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#191512]" />
              <h3 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#5A5046]">
                현장 사진 (Site Photography)
              </h3>
            </div>
            <span className="text-xs text-[#8A8075]">
              총 {record.photos.length}개 이미지
            </span>
          </div>

          {record.photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {record.photos.map((photo, i) => (
                <div
                  key={photo.id || i}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-4/3 rounded-xs overflow-hidden border border-[#E2DDD6] bg-[#FAF8F5] cursor-pointer"
                >
                  <img
                    src={photo.previewUrl}
                    alt={photo.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                    크게 보기
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#8A8075] bg-[#FAF8F5] border border-dashed border-[#E2DDD6] rounded-xs">
              첨부된 현장 사진이 없습니다.
            </div>
          )}
        </div>

        {/* Google Sheet Row Representation Table */}
        <div className="border-t border-[#EAE5DF] pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#5A5046] tracking-wide">
                Google Sheets 누적 저장된 행 데이터
              </span>
              <span className="text-[11px] text-[#8A8075]">
                (탭: {connectedSheet?.tabName || SHEET_TAB_NAME})
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenConnectModal('existing_sheet')}
              className="text-xs text-[#7A7067] hover:text-[#191512] underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"
            >
              시트 연동 상태 확인
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto border border-[#E2DDD6] rounded-xs bg-[#FAF8F5]">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2DDD6] bg-[#F2ECE4] text-[#4A4036] font-medium">
                  <th className="p-2.5">프로젝트 주제</th>
                  <th className="p-2.5">자재 리스트</th>
                  <th className="p-2.5">견적서</th>
                  <th className="p-2.5">실행가</th>
                  <th className="p-2.5">현장 사진</th>
                  <th className="p-2.5 whitespace-nowrap">저장일시</th>
                </tr>
              </thead>
              <tbody className="text-[#2C241E]">
                <tr>
                  <td className="p-2.5 border-r border-[#EAE5DF] max-w-[160px] truncate font-medium">{record.topic}</td>
                  <td className="p-2.5 border-r border-[#EAE5DF] max-w-[160px] truncate">{record.materials || '-'}</td>
                  <td className="p-2.5 border-r border-[#EAE5DF] max-w-[120px] truncate">{record.estimate || '-'}</td>
                  <td className="p-2.5 border-r border-[#EAE5DF] max-w-[120px] truncate">{record.executionCost || '-'}</td>
                  <td className="p-2.5 border-r border-[#EAE5DF] max-w-[100px] truncate">
                    {record.photos.length > 0 ? `${record.photos.length}장` : '없음'}
                  </td>
                  <td className="p-2.5 whitespace-nowrap text-[#6E645B] font-mono">{record.savedAt}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#EAE5DF] text-xs text-[#8A8075]">
          <span>B.house Interior Architecture & Space Design</span>
          <span className="italic mt-1 sm:mt-0 font-serif">“프레임과 여백의 균형으로 완성되는 공간”</span>
        </div>
      </article>

      {/* 3. Primary Next Action: Return to New Project Entry (Keeping Existing Sheet Connected!) */}
      <div className="flex flex-col items-center justify-center gap-2 pt-2">
        <button
          type="button"
          id="btn-reset-new-project"
          onClick={onResetNewProject}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#191512] hover:bg-[#2C241E] text-[#FAF8F5] text-sm font-medium tracking-wide rounded-xs transition-all cursor-pointer shadow-sm hover:shadow-md active:translate-y-px"
        >
          <PlusCircle className="w-4 h-4" />
          <span>다음 프로젝트 기록하기 (기존 시트에 계속 저장)</span>
        </button>
        <p className="text-[11px] text-[#7A7067]">
          * 기존 시트 연결이 유지되므로 다음 프로젝트도 번거로운 설정 없이 즉시 누적 저장됩니다.
        </p>
      </div>

      {/* Lightbox Modal for Photo inspection */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-sm p-2 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.previewUrl}
              alt={selectedPhoto.name}
              referrerPolicy="no-referrer"
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
            <div className="p-3 flex items-center justify-between text-xs text-[#5A5046]">
              <span className="font-medium truncate">{selectedPhoto.name}</span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1 hover:bg-[#F2ECE4] rounded-full text-[#191512] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
