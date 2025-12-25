"use client";

import React from 'react';

const QuoteSection: React.FC = () => {
  return (
    <div className="mt-16 bg-muted/50 rounded-2xl p-8 text-center max-w-[64rem] mx-auto">
      <h2 className="text-2xl font-bold mb-4 italic">"An investment in knowledge pays the best interest."</h2>
      <p className="text-muted-foreground">— Benjamin Franklin</p>
    </div>
  );
};

export default QuoteSection;