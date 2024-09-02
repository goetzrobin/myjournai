import { createFileRoute } from '@tanstack/react-router';
import { Link } from '~myjournai/components';

export const Route = createFileRoute('/_auth/start')({
  component: () => <div className="flex flex-grow flex-col justify-between items-center">
    <p className="pt-10 pb-32 mx-auto max-w-[80%] text-3xl text-center">Find your path, start your post
      athletics
      journey.</p>
    <div className="pb-8 flex flex-col items-center">
      <Link variant="primary" className="mb-4 w-full" to="/sign-up">Let's start</Link>
      <p className="text-center max-w-[80%] text-xs text-muted-foreground">By tapping start you agree to our <Link className="!text-xs"
        to="/terms">terms</Link> and
        <Link className="!text-xs" to="/privacy-policy"> privacy policy</Link>.</p>
    </div>
  </div>
});
