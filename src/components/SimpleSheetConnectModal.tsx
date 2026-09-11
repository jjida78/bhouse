import React, { useState, useEffect } from 'react';
import {
  X,
  Table,
  Check,
  ExternalLink,
  Copy,
  PlusCircle,
  Link2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { ConnectedSheet } from '../types';
import {
  SHEET_TAB_NAME,
  SHEET_COLUMNS,
  SHEET_HEADERS_TSV,
  createNewGoogleSheetUrl,
  isValidGoogleSheetUrl,
} from '../services/googleSheets';

interface SimpleSheetConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSheet: ConnectedSheet | null;
  onSaveConnection: (sheet: ConnectedSheet | null) => void;
  recordCount?: number;
  initialTab?: 'create_new' | 'existing_sheet';
}

export const SimpleSheetConnectModal: React.FC<SimpleSheetConnectModalProps> = ({
  isOpen,
  onClose,
  currentSheet,
  onSaveConnection,
  recordCount = 0,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'create_new' | 'existing_sheet'>(
    initialTab || (currentSheet ? 'existing_sheet' : 'create_new')
  );

  const [sheetInput, setSheetInput] = useState(currentSheet?.url || '');
  const [customTitle, setCustomTitle] = useState(currentSheet?.title || '');
  const [copiedHeaders, setCopiedHeaders] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || (currentSheet ? 'existing_sheet' : 'create_new'));
      setSheetInput(currentSheet?.url || '');
      setCustomTitle(currentSheet?.title || '');
      setInputError(null);
      setIsSuccess(false);
    }
  }, [isOpen, initialTab, currentSheet]);

  if (!isOpen) return null;

  // Open Google Sheets official instant creator (sheets.new) and auto-copy headers
  const handleOpenGoogleSheetsNew = async () => {
    try {
      await navigator.clipboard.writeText(SHEET_HEADERS_TSV);
      setCopiedHeaders(true);
      setTimeout(() => setCopiedHeaders(false), 5000);
    } catch (err) {
      console.warn('Failed to copy headers to clipboard', err);
    }
    // Open sheets.new in user's Google account
    window.open('https://sheets.new', '_blank');
  };

  // Copy header row TSV manually
  const handleCopyHeadersOnly = async () => {
    try {
      await navigator.clipboard.writeText(SHEET_HEADERS_TSV);
      setCopiedHeaders(true);
      setTimeout(() => setCopiedHeaders(false), 3000);
    } catch (err) {
      console.warn('Failed to copy headers', err);
    }
  };

  // Save new or modified connection
  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const cleanUrl = sheetInput.trim();

    if (!cleanUrl) {
      setInputError('Google 스프레드시트의 주소(URL)를 입력해주세요.');
      return;
    }

    if (!isValidGoogleSheetUrl(cleanUrl)) {
      setInputError(
        '유효한 Google 스프레드시트 주소가 아닙니다. 주소창의 전체 URL을 복사해주세요. (예: https://docs.google.com/spreadsheets/d/.../edit)'
      );
      return;
    }

    let title = customTitle.trim();
    if (!title) {
      title = 'B.house 인테리어 프로젝트 관리 대장';
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(
      now.getDate()
    ).padStart(2, '0')}`;

    const newConnection: ConnectedSheet = {
      url: cleanUrl,
      title,
      tabName: SHEET_TAB_NAME,
      connectedAt: formattedDate,
    };

    onSaveConnection(newConnection);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  const handleDisconnect = () => {
    if (window.confirm('구글시트 연결을 해제하시겠습니까? (저장된 프로젝트 기록은 안전하게 보존됩니다.)')) {
      onSaveConnection(null);
      setSheetInput('');
      setCustomTitle('');
      setActiveTab('create_new');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#191512]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] border border-[#DCD6CA] rounded-sm shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#EAE5DF] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E2DDD6] flex items-center justify-center text-[#191512]">
              <Table className="w-5 h-5 text-[#2C241E]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#191512]">
                Google Sheets 연결 가이드
              </h3>
              <p className="text-xs text-[#7A7067] mt-0.5">
                한 번만 등록해두시면 이후 모든 프로젝트가 해당 기존 시트에 계속 누적 저장됩니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#7A7067] hover:text-[#191512] hover:bg-[#FAF8F5] rounded-xs cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xs text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveTab('create_new');
              setInputError(null);
            }}
            className={`py-2 px-3 rounded-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'create_new'
                ? 'bg-[#FFFFFF] text-[#191512] shadow-xs font-semibold'
                : 'text-[#6E645B] hover:text-[#191512]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#5A5046]" />
            <span>1. 처음: 새 시트 만들어 등록</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('existing_sheet');
              setInputError(null);
            }}
            className={`py-2 px-3 rounded-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'existing_sheet'
                ? 'bg-[#FFFFFF] text-[#191512] shadow-xs font-semibold'
                : 'text-[#6E645B] hover:text-[#191512]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-[#5A5046]" />
            <span>2. 기존 시트에 계속 저장</span>
            {currentSheet && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] ml-0.5" />
            )}
          </button>
        </div>

        {/* TAB 1: 처음 새 시트 만들어 등록 */}
        {activeTab === 'create_new' && (
          <div className="space-y-4">
            {/* Guide on why real creation in Google is required */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xs text-xs text-[#5A5046] leading-relaxed">
              <span className="font-semibold text-[#191512] block mb-1">
                💡 왜 직접 구글 시트를 열어야 하나요?
              </span>
              Google의 보안 정책상, 스프레드시트는 각 사용자의 개인 Google 계정 안에서 직접 생성되어야만 고유 파일 주소가 부여됩니다. 아래 <strong>2단계</strong>를 따라하시면 10초 만에 완벽하게 연결됩니다!
            </div>

            {/* Step 1: Open sheets.new */}
            <div className="p-4 bg-[#FFFFFF] border-2 border-[#191512] rounded-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#191512] uppercase tracking-wider">
                  1단계 : Google에서 새 시트 열기
                </span>
                <span className="text-[11px] text-[#2D6A4F] font-medium bg-[#EBF3ED] px-2 py-0.5 rounded-xs">
                  원클릭 바로 생성
                </span>
              </div>

              <p className="text-xs text-[#6E645B]">
                아래 버튼을 누르면 <strong>Google 공식 새 스프레드시트</strong>가 새 탭에 바로 열리고, 표 헤더(열 제목 6개)가 자동으로 클립보드에 복사됩니다.
              </p>

              <button
                type="button"
                onClick={handleOpenGoogleSheetsNew}
                className="w-full py-3 bg-[#191512] hover:bg-[#2C241E] text-[#FAF8F5] rounded-xs text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Google 새 시트 열기 (sheets.new 바로가기)</span>
              </button>

              {copiedHeaders && (
                <div className="p-2.5 bg-[#EBF3ED] border border-[#CDE3D5] rounded-xs text-xs text-[#2D6A4F] flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    열 제목(헤더 6개)이 복사되었습니다! 새 시트의 <strong>1행(A1)</strong>을 누르고 <strong>Ctrl + V</strong>를 누르세요.
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Register URL */}
            <form onSubmit={handleSaveUrl} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-[#191512] block mb-1">
                  2단계 : 생성된 구글시트 주소창의 URL 붙여넣기
                </label>
                <input
                  type="text"
                  value={sheetInput}
                  onChange={(e) => {
                    setSheetInput(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  placeholder="https://docs.google.com/spreadsheets/d/1abc.../edit"
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xs focus:bg-[#FFFFFF] outline-none text-[#191512] ${
                    inputError ? 'border-[#B85443] ring-1 ring-[#B85443]' : 'border-[#DCD6CA] focus:border-[#191512]'
                  }`}
                />
                {inputError && (
                  <p className="text-[11px] text-[#A34332] mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{inputError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#191512] block mb-1">
                  시트 이름 (별칭, 선택사항)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="B.house 인테리어 프로젝트 관리 대장"
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DCD6CA] rounded-xs focus:border-[#191512] focus:bg-[#FFFFFF] outline-none text-[#191512]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EAE5DF]">
                <button
                  type="button"
                  onClick={handleCopyHeadersOnly}
                  className="text-xs text-[#6E645B] hover:text-[#191512] underline cursor-pointer inline-flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>헤더만 다시 복사</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 text-xs text-[#6E645B] hover:bg-[#FAF8F5] rounded-xs cursor-pointer"
                  >
                    닫기
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold bg-[#191512] hover:bg-[#2C241E] text-[#FAF8F5] rounded-xs cursor-pointer transition-colors inline-flex items-center gap-1.5"
                  >
                    {isSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#3A6B48]" />
                        <span>시트 연결 완료!</span>
                      </>
                    ) : (
                      <span>이 시트를 저장 시트로 등록</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: 기존 시트에 계속 저장하기 (설정 & 상태 확인) */}
        {activeTab === 'existing_sheet' && (
          <div className="space-y-4">
            {currentSheet ? (
              <div className="p-4 bg-[#FAF8F5] border border-[#DCD6CA] rounded-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2D6A4F]" />
                    <span className="text-xs font-semibold text-[#2D6A4F]">
                      기존 시트에 연속 누적 저장 중
                    </span>
                  </div>
                  <span className="text-[11px] text-[#7A7067]">
                    연결일: {currentSheet.connectedAt}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#191512]">
                    {currentSheet.title}
                  </h4>
                  <p className="text-xs text-[#6E645B] mt-0.5">
                    기록 대상 탭: <code className="font-mono bg-[#EAE5DF] px-1 py-0.5 rounded-xs text-[#2C241E]">{currentSheet.tabName || SHEET_TAB_NAME}</code>
                  </p>
                  <p className="text-[11px] text-[#7A7067] mt-1 break-all">
                    URL: {currentSheet.url}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#E2DDD6]">
                  <span className="text-xs text-[#5A5046]">
                    누적 기록 건수: <strong>{recordCount}건</strong>
                  </span>
                  <a
                    href={currentSheet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F2ECE4] border border-[#DCD6CA] rounded-xs text-xs font-medium text-[#191512] transition-colors"
                  >
                    <span>구글시트 열기</span>
                    <ExternalLink className="w-3 h-3 text-[#7A7067]" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center bg-[#FAF8F5] border border-dashed border-[#DCD6CA] rounded-xs space-y-2">
                <p className="text-xs text-[#6E645B]">
                  아직 등록된 Google 시트가 없습니다.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('create_new')}
                  className="text-xs text-[#191512] font-semibold underline cursor-pointer"
                >
                  [1. 처음: 새 시트 만들어 등록]을 진행해주세요.
                </button>
              </div>
            )}

            {/* Change existing sheet URL if needed */}
            <form onSubmit={handleSaveUrl} className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-[#191512] block">
                기존 시트 주소 변경 (다른 구글시트로 변경할 때)
              </label>
              <input
                type="text"
                value={sheetInput}
                onChange={(e) => {
                  setSheetInput(e.target.value);
                  if (inputError) setInputError(null);
                }}
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                className={`w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border rounded-xs focus:bg-[#FFFFFF] outline-none text-[#191512] ${
                  inputError ? 'border-[#B85443] ring-1 ring-[#B85443]' : 'border-[#DCD6CA] focus:border-[#191512]'
                }`}
              />
              {inputError && (
                <p className="text-[11px] text-[#A34332] text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{inputError}</span>
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#EAE5DF]">
                {currentSheet && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="inline-flex items-center gap-1 text-xs text-[#A34332] hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>시트 연결 해제</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 text-xs text-[#6E645B] hover:bg-[#FAF8F5] rounded-xs cursor-pointer"
                  >
                    닫기
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-[#191512] hover:bg-[#2C241E] text-[#FAF8F5] rounded-xs cursor-pointer transition-colors"
                  >
                    {isSuccess ? '변경 완료' : '기존 시트 정보 업데이트'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
