import React, { PropsWithChildren } from 'react';
import { Button } from '~myjournai/components';
import { LucideChevronLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const ChatContainer = ({ children }: PropsWithChildren) => <div
  className="flex flex-col w-full h-full relative pt-4">
  <div
    className="px-2 z-10 bg-gradient-to-b from-background -m-[1px] from-30% to-transparent absolute h-16 left-0 right-0 top-2">
    <Link to="/"><Button variant="icon"><span className="sr-only">Back to main</span><LucideChevronLeft/></Button></Link>
  </div>
  {children}</div>;
