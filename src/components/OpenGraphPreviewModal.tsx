import React from 'react';
import { X, Share2, Check, Copy, ExternalLink } from 'lucide-react';

interface OpenGraphPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenGraphPreviewModal: React.FC<OpenGraphPreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const ogTitle = 'B.house';
  const ogDesc =
    'B.house 인테리어 디자인 스튜디오 프로젝트 콘텐츠 정리 및 Google Sheets 누적 저장 관리 도구';
  const ogImage = '/og-image.jpg';

  const metaHtmlSnippet = `<!-- Open Graph (KakaoTalk, Naver, Facebook, Slack) -->
<meta property="og:type" content="website" />
<meta property="og:title" content="${ogTitle}" />
<meta property="og:description" content="${ogDesc}" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="B.house" />
<meta property="og:locale" content="ko_KR" />

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${ogTitle}" />
<meta name="twitter:description" content="${ogDesc}" />
<meta name="twitter:image" content="${ogImage}" />`;

  const handleCopyMeta = async () => {
    try {
      await navigator.clipboard.writeText(metaHtmlSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard error', e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#191512]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] border border-[#DCD6CA] rounded-sm shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-6 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#EAE5DF] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E2DDD6] flex items-center justify-center text-[#191512]">
              <Share2 className="w-5 h-5 text-[#2C241E]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#191512]">
                배포용 오픈 그래프 (Open Graph) 미리보기
              </h3>
              <p className="text-xs text-[#7A7067] mt-0.5">
                카카오톡, 슬랙, SNS 등에 링크를 공유할 때 나타나는 카드 미리보기입니다.
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

        {/* Social Card Preview (Kakao / Facebook / Twitter style) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6E645B]">
            <span className="font-semibold text-[#191512]">메신저 & SNS 공유 카드 시뮬레이션</span>
            <span className="text-[11px] bg-[#EBF3ED] text-[#2D6A4F] px-2 py-0.5 rounded-full font-medium">
              1200 × 630 규격 적용
            </span>
          </div>

          <div className="border border-[#D8D2C6] rounded-sm overflow-hidden bg-[#FFFFFF] shadow-sm">
            {/* OG Image */}
            <div className="aspect-[16/9] w-full bg-[#191512] relative overflow-hidden">
              <img
                src={ogImage}
                alt={ogTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#191512]/80 backdrop-blur-xs text-[#FAF8F5] px-2.5 py-1 rounded-xs text-[11px] font-medium tracking-wide">
                B.house Studio
              </div>
            </div>

            {/* OG Text Content */}
            <div className="p-4 bg-[#FAF8F5] space-y-1.5 border-t border-[#EAE5DF]">
              <div className="text-[11px] font-medium text-[#7A7067] uppercase tracking-wider">
                ais-pre-ibcapyu4xezlpbmuibu7jp-522597104034.asia-northeast1.run.app
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#191512] leading-snug">
                {ogTitle}
              </h4>
              <p className="text-xs text-[#6E645B] leading-relaxed line-clamp-2">
                {ogDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Meta tags summary */}
        <div className="space-y-2 pt-2 border-t border-[#EAE5DF]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#191512]">
              HTML 메타 태그 (index.html에 자동 적용됨)
            </span>
            <button
              type="button"
              onClick={handleCopyMeta}
              className="inline-flex items-center gap-1 text-xs text-[#5A5046] hover:text-[#191512] font-medium cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span className="text-[#2D6A4F]">복사 완료</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>태그 복사</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-[#191512] text-[#E5DFD5] p-3 rounded-xs text-[11px] font-mono overflow-x-auto leading-relaxed max-h-36">
            {metaHtmlSnippet}
          </pre>
        </div>

        {/* Close Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#191512] hover:bg-[#2C241E] text-[#FAF8F5] rounded-xs text-xs font-medium cursor-pointer transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
