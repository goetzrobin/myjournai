import { createLazyFileRoute } from '@tanstack/react-router';
import { useSignInMutation, useSignOutMutation } from '~myjournai/auth';
import { Button } from '~myjournai/components';

export const Route = createLazyFileRoute('/')({
  component: Index
});

function Index() {
  const mut = useSignInMutation();
  const so = useSignOutMutation();
  return (
    <div className="p-2">
      <button onClick={() => mut.mutate({
        email: 'tug29225@temple.edu',
        password: 'journaiGinny123!'
      }, { onSuccess: r => console.log(r) })}>Sign In
      </button>
      <Button onPress={() => so.mutate()}>Sign Out
      </Button>
    </div>
  );
}
