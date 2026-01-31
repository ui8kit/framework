/**
 * Layout - Example with Extends and Block
 */

import { Extends, DefineBlock, Var, Slot, Include } from '@ui8kit/template';

interface LayoutProps {
  title?: string;
  children?: React.ReactNode;
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Extends layout="base" />
      
      <DefineBlock name="title">
        <Var name="title" default="My App" />
      </DefineBlock>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              <Var name="title" default="My App" />
            </h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <DefineBlock name="content">
            <Slot name="content">
              {children}
            </Slot>
          </DefineBlock>
        </main>
        
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <DefineBlock name="footer">
              <p>&copy; 2025 My App. All rights reserved.</p>
            </DefineBlock>
          </div>
        </footer>
      </div>
    </>
  );
}
