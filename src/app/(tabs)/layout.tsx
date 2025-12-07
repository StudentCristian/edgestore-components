'use client';

import { Tabs } from '../tabs';

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-row justify-center mb-3">
        <Tabs />
      </div>
      {children}
    </>
  );
}
