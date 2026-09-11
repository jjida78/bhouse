import React from 'react';
import { Table, History, Sparkles, Share2 } from 'lucide-react';
import { ConnectedSheet } from '../types';

interface HeaderProps {
  connectedSheet: ConnectedSheet | null;
  recordCount: number;
  onOpenConnectModal: () => void;
  onOpenHistory: () => void;
  onFillSample?: () => void;
  onOpenOgPreview?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectedSheet,
  recordCount,
  onOpenConnectModal,
  onOpenHistory,
  onFillSample,
  onOpenOgPreview,
}) => {
  const isConnected = !!connectedSheet;

  return (
    <header className="border-b border-[#EAE5DF] bg-[#FAF8F5]/90 backdrop-blur-sm sticky top-0 z-30 transition-colors">
      <div className="max-w-4xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Brand Logo and Identity */}
          <div>
            <div className="flex items-center gap-3">
              <span className="font-editorial text-2xl sm:text-3xl tracking-tight text-[#191512] font-semibold">
                B.house
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#7A7067] px-2 py-0.5 border border-[#E2DDD6] rounded-xs">
                Studio Archive
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-[13px] text-[#6E645B] font-serif italic tracking-wide leading-relaxed">
              “공간의 본질을 발견하고, 프레임과 여백의 균형으로 오래 기억되는 공간을 디자인합니다.”
            </p>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {onFillSample && (
              <button
                type="button"
                id="btn-sample-fill"
                onClick={onFillSample}
                title="샘플 프로젝트 데이터 입력"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#5C524A] hover:text-[#191512] hover:bg-[#F2ECE4] rounded-xs transition-colors cursor-pointer border border-transparent hover:border-[#E2DDD6]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8D837A]" />
                <span className="hidden sm:inline">예시 입력</span>
              </button>
            )}

            {/* Past Records Count */}
            {recordCount > 0 && (
              <button
                type="button"
                id="btn-view-history"
                onClick={onOpenHistory}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#5C524A] hover:text-[#191512] hover:bg-[#F2ECE4] rounded-xs transition-colors cursor-pointer border border-[#E6E0D8]"
              >
                <History className="w-3.5 h-3.5 text-[#7A7067]" />
                <span>누적 기록 {recordCount}건</span>
              </button>
            )}

            {/* Google Sheets Status Badge */}
            <button
              type="button"
              id="btn-header-sheets-status"
              onClick={onOpenConnectModal}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-xs transition-all cursor-pointer border ${
                isConnected
                  ? 'bg-[#F2EFE9] text-[#2C241E] border-[#D4CBBF] hover:bg-[#EAE4DC]'
                  : 'bg-transparent text-[#7A7067] border-dashed border-[#D8D0C5] hover:bg-[#F5F0E8]'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-[#5A5046]" />
              <span>{isConnected ? '시트 연결됨' : '구글시트 연결'}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isConnected ? 'bg-[#2D6A4F]' : 'bg-[#C28C56]'
                }`}
              />
            </button>

            {/* Open Graph Preview Button */}
            {onOpenOgPreview && (
              <button
                type="button"
                id="btn-header-og-preview"
                onClick={onOpenOgPreview}
                title="배포용 오픈 그래프(OG) 미리보기"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#5C524A] hover:text-[#191512] hover:bg-[#F2ECE4] rounded-xs transition-colors cursor-pointer border border-[#E6E0D8]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#7A7067]" />
                <span className="hidden sm:inline">OG 미리보기</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
