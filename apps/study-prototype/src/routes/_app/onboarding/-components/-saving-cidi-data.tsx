import { Button } from '~myjournai/components';
import { Link } from '@tanstack/react-router';

const SavingCidiData = ({ isIdle, title, hideNextSection, description, label, to }: {
  isIdle: boolean,
  hideNextSection?: boolean,
  label: string;
  title: string,
  description: string,
  to: string,
  onComplete?: () => void
}) => {
  return isIdle ? null : <div
    className="p-4 grid fade-in animate-in [animation-duration:500ms] -m-2 z-10 absolute inset-0 bg-background/80 backdrop-blur">
    <div className="pt-8 relative">
      {hideNextSection ? null : <p className="text-sm font-semibold text-center mb-4">Next Section</p>}
      <h1 className="text-2xl font-medium text-center">{title}</h1>
      <p className="mt-4 text-muted-foreground text-center">{description}</p>

      <Link className="absolute bottom-4 w-full" to={to}>
        <Button className="w-full animate-in slide-in-from-bottom-2 fade-in-5">{label}</Button>
      </Link>
    </div>
  </div>;
};

export default SavingCidiData;
