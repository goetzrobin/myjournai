import { createFileRoute } from '@tanstack/react-router';
import { authenticateRoute } from '@myjournai/auth-client';
import { WithMobileNav } from '../-nav/with-mobile-nav';
import React, { PropsWithChildren, ReactNode } from 'react';
import { Brain, GraduationCap, ShieldAlert, Sprout } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const Route = createFileRoute('/_app/resources')({
  component: About,
  beforeLoad: authenticateRoute
});

const Section = ({ children, title, icon, className }: PropsWithChildren<{
  icon: ReactNode;
  title: string;
  className?: string
}>) => <div className="mb-8 pb-6 px-4 border-b">
  <div className={twMerge('pb-4 flex items-center', className)}>
    {icon}
    <span className="ml-2">{title}</span>
  </div>
  {children}
  <div className="bg-sky-600 rounded-lg h-40 w-full" />
</div>;

function About() {
  return <WithMobileNav>
    <div className="overflow-auto h-full pt-8">
      <Section icon={<ShieldAlert className="size-6" />} title="Crisis Information" />
      <Section icon={<GraduationCap className="size-6" />} title="On Campus Resources" />
      <Section icon={<Brain className="size-6" />} title="Mental Health" />
      <Section icon={<Sprout className="size-6" />} title="Wellness" />
    </div>
  </WithMobileNav>;
}
