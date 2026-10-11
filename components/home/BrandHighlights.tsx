import React from 'react';
import { Container } from '@/components/ui/Container';
import { ShieldCheck, Leaf, Recycle, Clock } from 'lucide-react';

interface HighlightItem {
  title: string;
  desc: string;
}

interface BrandHighlightsProps {
  highlights?: HighlightItem[];
}

export function BrandHighlights({ highlights }: BrandHighlightsProps) {
  const defaultItems: (HighlightItem & { icon: React.ReactNode })[] = [
    {
      title: '100% Bebas Mikroplastik',
      desc: 'Kemasan toxic-free & bleach-free tanpa risiko pelepasan mikroplastik berbahaya.',
      icon: <Recycle className="w-5 h-5 text-accent" />,
    },
    {
      title: 'Bebas Daun Senna (Aman Harian)',
      desc: 'Racikan herbal fungsional murni tanpa pencahar keras yang merusak ritme lambung.',
      icon: <ShieldCheck className="w-5 h-5 text-accent" />,
    },
    {
      title: 'Gula Sorgum & Madu Murni',
      desc: 'Alternatif pemanis sehat rendah glikemik untuk energi stabil tanpa lonjakan gula.',
      icon: <Leaf className="w-5 h-5 text-accent" />,
    },
    {
      title: 'Seduh Cepat < 3 Menit',
      desc: 'Kepraktisan grab-and-go modern dengan nutrisi botani daun & bunga utuh.',
      icon: <Clock className="w-5 h-5 text-accent" />,
    },
  ];

  const icons = [
    <Recycle key="1" className="w-5 h-5 text-accent" />,
    <ShieldCheck key="2" className="w-5 h-5 text-accent" />,
    <Leaf key="3" className="w-5 h-5 text-accent" />,
    <Clock key="4" className="w-5 h-5 text-accent" />,
  ];

  const items = highlights?.length
    ? highlights.map((h, i) => ({
        ...h,
        icon: icons[i % icons.length],
      }))
    : defaultItems;

  return (
    <section id="highlights" className="w-full bg-surface border-b border-border py-12 scroll-mt-20">
      <Container size="wide">
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${items.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 sm:gap-8`}>
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-4 rounded-md bg-background/50 border border-border/50 hover:border-border transition-colors"
            >
              <div className="p-3 rounded-md bg-muted flex-shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
