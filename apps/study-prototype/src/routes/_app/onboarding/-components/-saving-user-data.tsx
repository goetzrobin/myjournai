import { Button } from '~myjournai/components';
import { Link } from '@tanstack/react-router';

const SavingUserData = ({ status }: { status: 'pending' | 'success' | 'error' | 'idle' }) => {
  return status === 'idle' ? null : <div
    className="p-4 grid fade-in animate-in [animation-duration:500ms] -m-2 z-10 absolute inset-0 bg-background/80 backdrop-blur">
    <div className="pt-8 relative">
      <p className="text-sm font-semibold text-center mb-4">Let's Start The Survey</p>
      <h1 className="text-2xl font-medium text-center">Career Identity</h1>
      <p className="mt-4 text-muted-foreground text-center">8 questions</p>
      <p className="mt-12 text-lg px-4 leading-loose text-center">These next few questions are about the career you are planning to pursue. As you respond to the questions, please focus on the career you are most interested in and/or believe you will pursue.</p>

      <Link className="absolute bottom-4 w-full" to="/onboarding/study/career-identity-confusion/survey">
        <Button isDisabled={status !== 'success'} className="w-full animate-in slide-in-from-bottom-2 fade-in-5">Continue to questions</Button>
      </Link>
    </div>
  </div>;
};

export default SavingUserData;
