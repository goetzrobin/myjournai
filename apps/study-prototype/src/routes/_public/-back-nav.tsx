import { Link } from '@tanstack/react-router';
import { Button } from '~myjournai/components';
import { LucideChevronLeft } from 'lucide-react';

export const BackNav = () => {
  return <div className="flex justify-between items-center">
    <Link to="/"><Button variant="icon"><span
      className="sr-only">Back to main</span><LucideChevronLeft /></Button></Link>
  </div>;
};
