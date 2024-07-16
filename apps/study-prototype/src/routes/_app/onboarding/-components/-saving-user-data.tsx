import { Button } from '~myjournai/components';
import { Link } from '@tanstack/react-router';
import AlternatingMessages from './-alternating-messages';

const SavingUserData = ({ isIdle }: { isIdle: boolean }) => {
  const messages = ['Perfect and thank you so much!', 'The hardest part is done!', 'Getting started....', 'Ready to continue?'];
  return <AlternatingMessages showing={isIdle} messages={messages}>
    <Link to="/onboarding/career-identity-confusion/survey">
      <Button className="w-full animate-in slide-in-from-bottom-2 fade-in-5">Continue onboarding</Button>
    </Link>
  </AlternatingMessages>;
};

export default SavingUserData;
