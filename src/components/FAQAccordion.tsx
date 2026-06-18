"use client";

import React, { useState, useRef, useEffect } from "react";
import { BrandText } from "./BrandText";
import { ChevronDownIcon } from "./icons/AnimatedIcons";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  className = "",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => toggle(index)}
          index={index}
        />
      ))}
    </div>
  );
};

interface AccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className={`border transition-colors duration-300 rounded-lg overflow-hidden ${
        isOpen
          ? "border-brand-gold/40 bg-brand-gold/[0.03]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span
          className={`text-sm font-display font-light tracking-wide transition-colors duration-300 ${
            isOpen ? "text-brand-gold" : "text-brand-light group-hover:text-brand-light/90"
          }`}
        >
          <BrandText>{item.question}</BrandText>
        </span>
        <ChevronDownIcon
          size={16}
          isOpen={isOpen}
          className="shrink-0"
        />
      </button>
      <div
        style={{ height }}
        className="transition-[height] duration-300 ease-in-out overflow-hidden"
      >
        <div ref={contentRef} className="px-6 pb-5">
          <div className="w-12 h-[1px] bg-gradient-to-r from-brand-gold/40 to-transparent mb-3" />
          <p className="text-sm font-light text-brand-light/55 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;
