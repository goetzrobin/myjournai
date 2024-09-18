import { createFileRoute } from '@tanstack/react-router';
import { ARTICLES_BY_SLUG } from './-data';
import { Message } from '~myjournai/chat-client';
import { LucideChevronLeft } from 'lucide-react';
import React from 'react';
import { Link } from '~myjournai/components';

export const Route = createFileRoute('/_app/resources/$slug')({
  loader: ({ params }) => (ARTICLES_BY_SLUG[params.slug]),
  component: ResourceDetail
});

function ResourceDetail() {
  const data = Route.useLoaderData();
  return <div>
    <div
      className="mt-4 px-2 z-10 bg-gradient-to-b from-background -m-[1px] from-30% to-transparent h-16">
      <div className="flex justify-between items-center">
        <Link variant="icon" to="/resources"><span
          className="sr-only">Back to main</span><LucideChevronLeft /></Link>
      </div>
    </div>
    <h1 className="-mt-4 mb-4 text-3xl px-2">{data.title}</h1>
    <div className="pb-24 text-pretty px-2">
      <Message content={data.content} />
    </div>
  </div>
    ;
}


