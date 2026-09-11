import React from 'react';

interface InputGroupTopicProps {
  value: string;
  onChange: (val: string) => void;
  error?: string | null;
}

export const InputGroupTopic: React.FC<InputGroupTopicProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <section id="section-project-topic" className="group">
      <div className="flex items-baseline justify-between mb-2">
        <label
          htmlFor="input-project-topic"
          className="text-sm font-semibold tracking-wide text-[#191512] flex items-center gap-2"
        >
          <span className="font-editorial text-base text-[#8C8277]">01</span>
          <span>프로젝트 주제</span>
          <span className="text-[#A35D4D] text-xs font-normal">*필수</span>
        </label>
        <span className="text-xs text-[#8A8075] font-light">
          공간명 및 핵심 아이덴티티
        </span>
      </div>

      <div className="relative">
        <textarea
          id="input-project-topic"
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="프로젝트의 주제 또는 공간의 핵심 컨셉을 입력하세요."
          className={`w-full px-4 py-3.5 text-[15px] sm:text-base leading-relaxed bg-[#FFFFFF] border rounded-sm transition-all outline-none resize-none placeholder:text-[#AAA298] text-[#191512] ${
            error
              ? 'border-[#B85443] ring-1 ring-[#B85443]/20'
              : 'border-[#E2DDD6] focus:border-[#191512] focus:ring-1 focus:ring-[#191512]/10 hover:border-[#D0C9C0]'
          }`}
        />
      </div>

      {error && (
        <p id="error-project-topic" className="mt-1.5 text-xs text-[#B85443] flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </section>
  );
};
