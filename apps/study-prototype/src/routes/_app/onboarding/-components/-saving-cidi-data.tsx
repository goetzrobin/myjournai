import { Button } from '~myjournai/components';
import { Link } from '@tanstack/react-router';
import AlternatingMessages from './-alternating-messages';

const SavingCidiData = ({ isIdle }: { isIdle: boolean }) => {
  const completeCidi = () => localStorage.setItem('journai-cidi-complete', 'true');
  const messages = ['Perfect! Thanks for putting up with us!', 'Your answers help us and Sam to make your life better!', 'Who\'s Sam?', 'Your new AI mentor.', 'Ready to meet Sam?'];
  return <AlternatingMessages onComplete={completeCidi} showing={isIdle} messages={messages}>
    <Link to="/onboarding/career-identity-confusion/convo">
      <Button className="w-full animate-in slide-in-from-bottom-2 fade-in-5">Let's do it!</Button>
    </Link>
  </AlternatingMessages>;
};

export default SavingCidiData;
