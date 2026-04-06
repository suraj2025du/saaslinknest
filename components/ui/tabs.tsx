'use client';

import { createContext, useContext, useState } from 'react';

const TabsContext = createContext<any>({});

export function Tabs({ defaultValue, children, className }: any) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: any) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value, children, className }: any) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`${className} transition-colors ${isActive ? 'bg-white/10 text-white font-bold border-b-2 border-[#7C3AED]' : 'text-slate-400 hover:text-white'}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: any) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
}
