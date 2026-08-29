const LINE = 'Linen  ·  Oak  ·  Wool  ·  Brass  ·  Travertine  ·  Walnut  ·  Washi  ·  ';

const WordMarquee = () => (
  <div className="overflow-hidden border-y border-ink/10 bg-sand py-4">
    <div className="velora-marquee flex w-max text-sm uppercase tracking-[0.28em] text-ink-soft">
      <span className="px-4">{LINE.repeat(4)}</span>
      <span className="px-4">{LINE.repeat(4)}</span>
    </div>
  </div>
);

export default WordMarquee;
