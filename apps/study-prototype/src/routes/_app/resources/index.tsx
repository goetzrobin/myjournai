import { createFileRoute } from '@tanstack/react-router';
import { authenticateRoute } from '~myjournai/auth-client';
import { WithMobileNav } from '../../-nav/with-mobile-nav';
import React, { PropsWithChildren, ReactNode } from 'react';
import { LucideChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Link } from '~myjournai/components';
import { RESOURCE_SECTIONS, ResourceArticle } from './-data';

export const Route = createFileRoute('/_app/resources/')({
  component: About,
  beforeLoad: authenticateRoute
});

const Section = ({ articles, title, icon, className }: PropsWithChildren<{
  icon: ReactNode;
  title: string;
  articles?: ResourceArticle[];
  className?: string
}>) => <div className="mb-8 pb-2">
  <div className={twMerge('pb-4 flex items-center', className)}>
    {icon}
    <span className="ml-2">{title}</span>
  </div>
  <div className="flex px-4 pb-6 items-center space-x-8 overflow-x-auto">
    {articles?.map((article: ResourceArticle, i) => <Card key={article.link + '-' + i} {...article} />)}
  </div>
  <hr className="mx-auto w-full" />
</div>;
const Card = ({ link, title, minutes, hideLink }: PropsWithChildren<{
  className?: string;
  minutes?: number;
  title?: string;
  hideLink?: boolean;
  link?: string
}>) => <div
  className="flex flex-col flex-none bg-gradient-to-b to-80% to-muted/60 from-blue-500 border rounded-2xl h-52 w-80 p-4">
  <div className="flex-1">
    <h2
      className="text-pretty font-serif text-xl">{title ?? 'What to Do when You Want to Build Better Habits But Can\'t Get Stated'}</h2>
  </div>
  {hideLink ? null : <div className="flex-none flex justify-between items-center">
    <span className="text-sm font-medium">{minutes ?? 0} minute{(minutes ?? 0) === 1 ? '' : 's'} to read</span>
    <Link to={`/resources/${link}`} className="p-2 rounded-full"><LucideChevronRight
      className="size-5" /></Link>
  </div>}
</div>;

function About() {
  return <WithMobileNav>
    <div className="overflow-auto h-full">
      <h1 className="ml-2 text-3xl">Resources</h1>
      <div className="pb-12 pt-8">
        {RESOURCE_SECTIONS.map((s,i) => <Section key={i} {...s} />)}
      </div>
    </div>
  </WithMobileNav>;
}
