import React from 'react';
import { Container } from '@/components/ui/Container';
import { ShieldCheck, Leaf, Recycle } from 'lucide-react';

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
      title: '100% Tanaman Herbal Murni',
      desc: 'Bebas perisa buatan, pewarna sintetis, dan bahan kimia pengawet buatan.',
      icon: <Leaf className="w-5 h-5 text-accent" />,
    },
    {
      title: 'Bebas Kafein & Lembut di Lambung',
      desc: 'Energi alami yang stabil tanpa lonjakan detak jantung atau caffeine crash.',
      icon: <ShieldCheck className="w-5 h-5 text-accent" />,
    },
    {
      title: 'Kantung Piramida Biodegradable',
      desc: 'Dibuat dari pati jagung terurai alami tanpa risiko serpihan mikroplastik.',
      icon: <Recycle className="w-5 h-5 text-accent" />,
    },
  ];

  const items = highlights?.length
    ? highlights.map((h, i) => ({
        ...h,
        icon: defaultItems[i % defaultItems.length].icon,
      }))
    : defaultItems;

  return (
    <section id="highlights" className="w-full bg-surface border-b border-border py-12">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
          {items.map((item, idx) => (
            <div
              key={item.title}
              className={`flex items-start gap-4 ${idx > 0 ? 'pt-6 md:pt-0 md:pl-8' : ''}`}
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
