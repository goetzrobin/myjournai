import { createFileRoute } from '@tanstack/react-router';
import { useAxios } from '~myjournai/http-client';
import { useQuery } from '@tanstack/react-query';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import { Message } from '~myjournai/chat-client';
import { Link } from '~myjournai/components';

export const Route = createFileRoute('/_app/offboarding/final-word-from-sam')({
  component: FinalWordFromSam
});

const finalMessageQuery = (userId: string | null | undefined) => {
  const axios = useAxios();
  return useQuery({
    queryKey: ['final-message', userId],
    queryFn: () => axios.get<{
      finalMessage: string;
    }>(`/api/users/${userId}/final-message`).then(({ data }) => data)
  });
};


function FinalWordFromSam() {
  const userId = useAuthUserIdFromHeaders();
  const finalMQ = finalMessageQuery(userId);
  console.log(finalMQ);
  return <div className="p-4">
    <h1 className="mb-8 text-2xl text-center">A final message from Sam</h1>
    {finalMQ.isPending ? <div className="space-y-2">
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 !mb-8 bg-muted animate-pulse"></div>

        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 !mb-8 bg-muted animate-pulse"></div>

        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl py-2 bg-muted animate-pulse"></div>
        <div className="rounded-xl !mb-12 py-2 bg-muted animate-pulse"></div>

      </div>
      : <Message className="mb-12" content={finalMQ.data?.finalMessage ?? ''} />}
    <Link className="text-center w-full block" to="/">Back Home</Link>
  </div>;
}
