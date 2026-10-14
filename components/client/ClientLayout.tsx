'use client';

import React from 'react';
import { ClientSidebar } from './ClientSidebar';
import { ClientNavbar } from './ClientNavbar';
import { CartDrawer } from '@/components/order/CartDrawer';

interface ClientLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  subtitle?: string;
  bgClassName?: string;
}

export function ClientLayout({ 
  children, 
  pageTitle, 
  subtitle,
  bgClassName = 'bg-[#FAFAF8]' 
}: ClientLayoutProps) {
  return (
    <div className={`min-h-screen ${bgClassName} text-neutral-900 font-sans select-none flex flex-col relative`}>
      {/* Collapsible Hover Sidebar (Desktop Left / Mobile Bottom) */}
      <ClientSidebar />

      {/* Main Content Area: Offset by sidebar width on desktop, padded on mobile for bottom dock */}
      <div className="flex-1 flex flex-col md:pl-[72px] pb-20 md:pb-0 transition-all duration-300">
        
        {/* Refined Top Navbar */}
        <ClientNavbar pageTitle={pageTitle} subtitle={subtitle} />

        {/* Page Content */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>

      {/* Global Redesigned Cart & Checkout Drawer */}
      <CartDrawer />
    </div>
  );
}
