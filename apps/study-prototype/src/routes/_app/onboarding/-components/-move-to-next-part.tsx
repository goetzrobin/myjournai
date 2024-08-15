import React from 'react';
import AlternatingMessages from './-alternating-messages';
import { Link } from '@tanstack/react-router';
import { Button } from '~myjournai/components';

const MoveToNextPart = ({ showing }: { showing: boolean }) => {
  const messages = ['Ready to continue?'];
  return <AlternatingMessages showing={showing} messages={messages}>
    <Link to="/onboarding/study/career-identity-confusion/survey">
      <Button className="w-full animate-in slide-in-from-bottom-2 fade-in-5">Continue onboarding</Button>
    </Link>
  </AlternatingMessages>;
};

export default MoveToNextPart;
