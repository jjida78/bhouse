import React from 'react';
import { Table, ExternalLink, PlusCircle, Settings2, CheckCircle2, Link2 } from 'lucide-react';
import { ConnectedSheet } from '../types';
import { SHEET_TAB_NAME } from '../services/googleSheets';

interface GoogleSheetsConnectionBarProps {
  connectedSheet: ConnectedSheet | null;
  onOpenConnectModal: (tab?: 'create_new' | 'existing_sheet') => void;
  highlightWarning?: boolean;
  recordCount?: number;
}

export const GoogleSheetsConnectionBar: React.FC<GoogleSheetsConnectionBarProps> = ({
  connectedSheet,
  onOpenConnectModal,
  highlightWarning,
  recordCount = 0,
}) => {
  const isConnected = !!connectedSheet;

  return (
    <section
      id="section-google-sheets-connection"
      className={`bg-[#FFFFFF] border rounded-sm p-4 sm:p-5 transition-all duration-300 shadow-xs ${
        highlightWarning && !isConnected
          ? 'border-[#B85443] ring-2 ring-[#B85443]/20 bg-[#FDF9F8]'
          : isConnected
          ? 'border-[#D9D3C7]'
          : 'border-[#EAE5DF]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Section Title & Status Indicator */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Table className="w-4 h-4 text-[#5A5046]" />
            <h2 className="text-sm font-semibold tracking-wide text-[#191512]">
              Google Sheets 저장소
            </h2>

            {/* Connection Status Indicator */}
            {isConnected ? (
              <span
                id="status-sheets-connected"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF3ED] text-[#2D6A4F] border border-[#CDE3D5]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>시트 연결 완료 (기존 시트에 연속 누적 저장 중)</span>
              </span>
            ) : (
              <span
                id="status-sheets-required"
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  highlightWarning
                    ? 'bg-[#FBF0EE] text-[#A34332] border border-[#F2C2BA] animate-pulse'
                    : 'bg-[#F5F2EB] text-[#7A7067] border border-[#E5DFD5]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    highlightWarning ? 'bg-[#A34332]' : 'bg-[#C28C56]'
                  }`}
                />
                Google 시트 등록 필요
              </span>
            )}
          </div>

          {/* Subtext info */}
          <p className="text-xs text-[#7A7067] leading-relaxed">
            {isConnected ? (
              <span>
                <span className="text-[#2D6A4F] font-semibold mr-1">✓ 연결 완료:</span>
                <strong className="text-[#2C241E] font-medium">[{connectedSheet.title}]</strong> 시트의{' '}
                <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded-xs border border-[#EAE5DF] font-sans text-[#4A4036]">{connectedSheet.tabName || SHEET_TAB_NAME}</code> 탭에 자동으로 계속 누적 저장됩니다.
                {recordCount > 0 && (
                  <span className="text-[#2D6A4F] font-medium ml-2">({recordCount}건 누적 보존 중)</span>
                )}
              </span>
            ) : (
              <span>
                처음 1회 Google 시트를 등록하면, 이후 모든 프로젝트가 해당 기존 시트에 계속 누적 저장됩니다.
              </span>
            )}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
          {isConnected ? (
            <>
              {connectedSheet.url && (
                <a
                  href={connectedSheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="link-open-connected-sheet"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#191512] bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD6CA] rounded-xs transition-colors"
                >
                  <span>구글시트 열기</span>
                  <ExternalLink className="w-3 h-3 text-[#7A7067]" />
                </a>
              )}
              <button
                type="button"
                id="btn-manage-sheets-connection"
                onClick={() => onOpenConnectModal('existing_sheet')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5A5046] hover:text-[#191512] hover:bg-[#FAF8F5] border border-[#EAE5DF] rounded-xs transition-colors cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5 text-[#7A7067]" />
                <span>시트 관리 / 새 시트 만들기</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-create-new-sheet"
                onClick={() => onOpenConnectModal('create_new')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium tracking-wide rounded-xs transition-all cursor-pointer shadow-xs ${
                  highlightWarning
                    ? 'bg-[#A34332] text-white hover:bg-[#8F3728] ring-2 ring-[#A34332]/20'
                    : 'bg-[#191512] text-[#FAF8F5] hover:bg-[#2C241E]'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>처음: 새 시트 만들기</span>
              </button>
              <button
                type="button"
                id="btn-connect-existing-sheet"
                onClick={() => onOpenConnectModal('existing_sheet')}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-[#5A5046] hover:text-[#191512] bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD6CA] rounded-xs transition-colors cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5 text-[#7A7067]" />
                <span>기존 시트 연결</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
