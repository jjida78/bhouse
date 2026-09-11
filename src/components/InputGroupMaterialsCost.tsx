import React, { useState } from 'react';
import { Layers, FileText, DollarSign, SplitSquareVertical } from 'lucide-react';

interface InputGroupMaterialsCostProps {
  materials: string;
  estimate: string;
  executionCost: string;
  onChangeMaterials: (val: string) => void;
  onChangeEstimate: (val: string) => void;
  onChangeExecutionCost: (val: string) => void;
  error?: string | null;
}

export const InputGroupMaterialsCost: React.FC<InputGroupMaterialsCostProps> = ({
  materials,
  estimate,
  executionCost,
  onChangeMaterials,
  onChangeEstimate,
  onChangeExecutionCost,
  error,
}) => {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');

  // Helper to parse bulk paste if designer copied a block from KakaoTalk or memo
  const handleApplyBulkText = () => {
    if (!bulkText.trim()) return;
    
    // Check if the bulk text contains headings or lines
    const lines = bulkText.split('\n');
    let curSection: 'mat' | 'est' | 'exec' | null = null;
    let matArr: string[] = [];
    let estArr: string[] = [];
    let execArr: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (/자재|마감|스펙|material/i.test(trimmed)) {
        curSection = 'mat';
        return;
      }
      if (/견적|제안|estimate/i.test(trimmed)) {
        curSection = 'est';
        return;
      }
      if (/실행|원가|비용|cost/i.test(trimmed)) {
        curSection = 'exec';
        return;
      }

      if (curSection === 'mat') matArr.push(trimmed);
      else if (curSection === 'est') estArr.push(trimmed);
      else if (curSection === 'exec') execArr.push(trimmed);
      else {
        // Default accumulation
        matArr.push(trimmed);
      }
    });

    if (matArr.length > 0) onChangeMaterials(matArr.filter(Boolean).join('\n'));
    if (estArr.length > 0) onChangeEstimate(estArr.filter(Boolean).join('\n'));
    if (execArr.length > 0) onChangeExecutionCost(execArr.filter(Boolean).join('\n'));
    
    setIsBulkMode(false);
  };

  return (
    <section id="section-materials-cost" className="group">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3 gap-1">
        <label className="text-sm font-semibold tracking-wide text-[#191512] flex items-center gap-2">
          <span className="font-editorial text-base text-[#8C8277]">02</span>
          <span>자재 / 견적 / 실행가</span>
          <span className="text-[#A35D4D] text-xs font-normal">*필수</span>
        </label>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#8A8075] font-light">
            스펙 및 예산 실행 데이터
          </span>
          <button
            type="button"
            id="btn-toggle-bulk-mode"
            onClick={() => setIsBulkMode(!isBulkMode)}
            className="text-[11px] text-[#6E645B] hover:text-[#191512] inline-flex items-center gap-1 underline underline-offset-2 cursor-pointer transition-colors"
          >
            <SplitSquareVertical className="w-3 h-3" />
            {isBulkMode ? '개별 입력으로 전환' : '통합 붙여넣기 모드'}
          </button>
        </div>
      </div>

      {isBulkMode ? (
        <div className="bg-[#FFFFFF] border border-[#E2DDD6] p-4 rounded-sm">
          <div className="mb-2 text-xs text-[#6E645B]">
            메모나 메신저에서 복사한 자재, 견적, 실행가 내용을 아래에 한 번에 붙여넣으세요.
          </div>
          <textarea
            id="input-bulk-materials-cost"
            rows={6}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="[자재]&#10;바닥: 오크 원목마루 190폭&#10;벽체: 벤자민무어 스카프페인트 웜화이트&#10;&#10;[견적서]&#10;총 9,200만 원 (철거 800, 목공 2,200, 도장/마감 3,400, 설비 2,800)&#10;&#10;[실행가]&#10;총 7,450만 원 (자재비 4,100, 노무비 2,650, 경비 700)"
            className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E2DDD6] rounded-xs outline-none focus:border-[#191512] font-mono leading-relaxed"
          />
          <div className="mt-2.5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsBulkMode(false)}
              className="px-3 py-1.5 text-xs text-[#6E645B] hover:bg-[#F2ECE4] rounded-xs cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleApplyBulkText}
              className="px-3.5 py-1.5 text-xs bg-[#191512] text-[#FAF8F5] hover:bg-[#2C2520] rounded-xs cursor-pointer transition-colors"
            >
              항목별 자동 반영하기
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Sub-item 1: 자재 리스트 */}
          <div className="bg-[#FFFFFF] p-3.5 border border-[#E2DDD6] hover:border-[#D0C9C0] focus-within:border-[#191512] rounded-sm transition-colors flex flex-col">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-[#2C241E]">
              <Layers className="w-3.5 h-3.5 text-[#7A7067]" />
              <span>자재 리스트 (Materials)</span>
            </div>
            <textarea
              id="input-materials-list"
              rows={4}
              value={materials}
              onChange={(e) => onChangeMaterials(e.target.value)}
              placeholder="예: 원목마루 오크 190폭, 600*1200 포세린 타일, 벤자민무어 도장, 천연 무늬목 수납장"
              className="w-full text-xs sm:text-sm text-[#191512] placeholder:text-[#AAA298] bg-transparent outline-none resize-none leading-relaxed flex-1"
            />
          </div>

          {/* Sub-item 2: 견적서 */}
          <div className="bg-[#FFFFFF] p-3.5 border border-[#E2DDD6] hover:border-[#D0C9C0] focus-within:border-[#191512] rounded-sm transition-colors flex flex-col">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-[#2C241E]">
              <FileText className="w-3.5 h-3.5 text-[#7A7067]" />
              <span>견적서 (Estimate)</span>
            </div>
            <textarea
              id="input-estimate-info"
              rows={4}
              value={estimate}
              onChange={(e) => onChangeEstimate(e.target.value)}
              placeholder="예: 제안 공급가 92,000,000원 (철거/목공 2800만, 마감 3800만, 가구 1600만, 감리 1000만)"
              className="w-full text-xs sm:text-sm text-[#191512] placeholder:text-[#AAA298] bg-transparent outline-none resize-none leading-relaxed flex-1"
            />
          </div>

          {/* Sub-item 3: 실행가 */}
          <div className="bg-[#FFFFFF] p-3.5 border border-[#E2DDD6] hover:border-[#D0C9C0] focus-within:border-[#191512] rounded-sm transition-colors flex flex-col">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-[#2C241E]">
              <DollarSign className="w-3.5 h-3.5 text-[#7A7067]" />
              <span>실행가 (Execution Cost)</span>
            </div>
            <textarea
              id="input-execution-cost"
              rows={4}
              value={executionCost}
              onChange={(e) => onChangeExecutionCost(e.target.value)}
              placeholder="예: 실제 실행 원가 74,500,000원 (자재 실발주 4100만, 시공 노무비 2650만, 현장경비 700만)"
              className="w-full text-xs sm:text-sm text-[#191512] placeholder:text-[#AAA298] bg-transparent outline-none resize-none leading-relaxed flex-1"
            />
          </div>
        </div>
      )}

      {error && (
        <p id="error-materials-cost" className="mt-2 text-xs text-[#B85443] flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </section>
  );
};
