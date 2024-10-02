import { createFileRoute } from '@tanstack/react-router';
import { Link } from '~myjournai/components';

export const Route = createFileRoute('/_app/offboarding/')({
  component: () => <div className="relative h-full w-full p-4">
    <h1 className="text-2xl font-medium text-center">You've almost made it to the end of your journey!</h1>
    <p className="mt-4 text-muted-foreground text-center">All that's left to do is complete the final survey for our research partners and see if these last weeks have helped you narrow down you path towards a fulfilled future!</p>
    <Link className="absolute bottom-4 left-0 right-0 block text-center" to="/offboarding/study/career-identity-confusion/survey">Start Survey</Link>
  </div>
})
