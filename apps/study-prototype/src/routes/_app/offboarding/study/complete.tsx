import { createFileRoute } from '@tanstack/react-router';
import { useCidiPostQuery, useCidiPreQuery } from '~myjournai/cidi-client';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import {
  CIDI_CAREER_COMMITMENT_QUALITY_SURVEY,
  CIDI_CAREER_EXPLORATION_BREADTH_SELF_SURVEY,
  CIDI_CAREER_EXPLORATION_DEPTH_SELF_SURVEY,
  CIDI_CAREER_IDENTITY_CONFUSION_SURVEY,
  CIDI_PAST_CAREER_EXPLORATION_BREADTH_SELF_SURVEY,
  Survey
} from '~myjournai/survey';
import { CidiSurveyResponses } from '~db/schema/cidi-survey-responses';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { Link } from '~myjournai/components';

export const likertScale: Record<number, string> = {
  1: 'Strongly Disagree',
  2: 'Disagree',
  3: 'Neither Disagree nor Agree',
  4: 'Agree',
  5: 'Strongly Agree'
};

export const Route = createFileRoute('/_app/offboarding/study/complete')({
  component: Complete
});


const SurveyCategory = ({ title, preResults, postResults, survey }: {
  title: string;
  preResults?: CidiSurveyResponses;
  postResults?: CidiSurveyResponses;
  survey: Survey
}) => <div className="mt-4 pb-8">
  <div>
    <h2 className="text-center font-semibold text-lg">{title}</h2>
    {survey.questions.map(q => {
      const preScore = (preResults as unknown as Record<string, number>)?.[('question1' + q.index)] ?? 0;
      const postScore = (postResults as unknown as Record<string, number>)?.[('question1' + q.index)] ?? 0;
      const numericalDifference = postScore - preScore;
      const trend = q.direction === 'bigger-better' ? numericalDifference > 0 ? 'improved' : 'declined' : numericalDifference < 0 ? 'improved' : 'declined';
      return <div key={q.question} className="px-2 font-medium pt-8 pb-12">
        <p className="mb-4">{q.question}</p>
        <div
          className="flex flex-col gap-4">
          <div className="opacity-50">
            <div className="text-muted-foreground text-sm font-medium">Before</div>
            <div className="text-sm font-bold">{likertScale[preScore] ?? 'Unknown'}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm font-medium">After</div>
            <div
              className={(trend === 'improved' ? 'text-green-200' : 'text-red-200') + ' text-sm font-bold'}>{likertScale[postScore] ?? 'Unknown'}</div>
          </div>
        </div>
      </div>;
    })}
    <hr />
  </div>
</div>;


const finalDataQuery = (userId: string | null | undefined) => {
  const axios = useAxios();
  return useQuery({
    queryKey: ['final-data', userId],
    queryFn: () => axios.get<{
      sessionsCompleted: number
      wordsWritten: number;
      wordsRead: number;
      avgPreFeeling: number;
      avgPreAnxiety: number;
      avgPreMotivation: number;
      avgPostFeeling: number;
      avgPostAnxiety: number;
      avgPostMotivation: number;
    }>(`/api/users/${userId}/final-data`).then(({ data }) => data)
  });
};

// Utility function to map scores to descriptive responses
const scoreToFeelingText = (score: number | null | undefined): string => {
  switch (score) {
    case 0:
      return 'Awful';
    case 1:
      return 'Meh';
    case 2:
      return 'Good';
    case 3:
      return 'Great';
    default:
      return 'Unknown';
  }
};

const scoreToMotivationText = (score: number | null | undefined): string => {
  switch (score) {
    case 0:
      return 'Not at all motivated';
    case 1:
      return 'Slightly motivated';
    case 2:
      return 'Quite motivated';
    case 3:
      return 'Highly motivated';
    default:
      return 'Unknown';
  }
};

const scoreToAnxietyText = (score: number | null | undefined): string => {
  switch (score) {
    case 0:
      return 'Not at all anxious';
    case 1:
      return 'Slightly anxious';
    case 2:
      return 'Quite anxious';
    case 3:
      return 'Extremely anxious';
    default:
      return 'Unknown';
  }
};


function Complete() {
  const userId = useAuthUserIdFromHeaders();
  const preQ = useCidiPreQuery(userId);
  const postQ = useCidiPostQuery(userId);
  const finalQ = finalDataQuery(userId);
  return <div className="py-8 px-2">
    <div className="place-self-center w-full">
      <h1 className="mb-8 text-2xl text-center">Let's see how it went!</h1>
      <div className="px-2 pb-8">
        <h2 className="items-center text-lg mb-2 font-semibold tabular-nums flex justify-between">
          <span>Sessions Completed: </span><span>{finalQ.data?.sessionsCompleted?.toLocaleString()}</span></h2>
        <h2 className="items-center text-lg mb-2 font-semibold tabular-nums flex justify-between">
          <span>Words Read: </span><span>{finalQ.data?.wordsRead?.toLocaleString()}</span></h2>
        <h2 className="items-center text-lg mb-2 font-semibold tabular-nums flex justify-between">
          <span>Words Written: </span><span>{finalQ.data?.wordsWritten?.toLocaleString()}</span></h2>

        <h2 className="items-center text-lg mt-8 mb-2 font-semibold tabular-nums flex justify-between">
          How sessions affected you in the moment:
        </h2>
        <div className="font-medium pt-4 pb-8">
          <p className="mb-4">How you felt:</p>
          <div
            className="flex gap-4">
            <div className="w-40 opacity-50">
              <div className="text-muted-foreground text-sm font-medium">Before</div>
              <div className="text-sm font-bold">{scoreToFeelingText(finalQ?.data?.avgPreFeeling)}</div>
            </div>
            <div className="w-40">
              <div className="text-muted-foreground text-sm font-medium">After</div>
              <div
                className={(((finalQ?.data?.avgPostFeeling ?? 0) - (finalQ?.data?.avgPreFeeling ?? 0)) > 0 ? 'text-green-200' : 'text-red-200') + ' text-sm font-bold'}>{scoreToFeelingText(finalQ?.data?.avgPostFeeling)}</div>
            </div>
          </div>
        </div>
        <div className="font-medium pt-4 pb-8">
          <p className="mb-4">How motivated you were:</p>
          <div
            className="flex gap-4">
            <div className="w-40 opacity-50">
              <div className="text-muted-foreground text-sm font-medium">Before</div>
              <div className="text-sm font-bold">{scoreToMotivationText(finalQ?.data?.avgPreMotivation)}</div>
            </div>
            <div className="w-40">
              <div className="text-muted-foreground text-sm font-medium">After</div>
              <div
                className={(((finalQ?.data?.avgPostMotivation ?? 0) - (finalQ?.data?.avgPreMotivation ?? 0)) > 0 ? 'text-green-200' : 'text-red-200') + ' text-sm font-bold'}>{scoreToMotivationText(finalQ?.data?.avgPostMotivation)}</div>
            </div>
          </div>
        </div>
        <div className="font-medium pt-4 pb-8">
          <p className="mb-4">How anxious you were:</p>
          <div
            className="flex gap-4">
            <div className="w-40 opacity-50">
              <div className="text-muted-foreground text-sm font-medium">Before</div>
              <div className="text-sm font-bold">{scoreToAnxietyText(finalQ?.data?.avgPreAnxiety)}</div>
            </div>
            <div className="w-40">
              <div className="text-muted-foreground text-sm font-medium">After</div>
              <div
                className={(((finalQ?.data?.avgPostAnxiety ?? 0) - (finalQ?.data?.avgPreAnxiety ?? 0)) < 0 ? 'text-green-200' : 'text-red-200') + ' text-sm font-bold'}>{scoreToAnxietyText(finalQ?.data?.avgPostAnxiety)}</div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="items-center text-lg mt-8 mb-2 font-semibold tabular-nums flex justify-between">
        How the experience affected your career readiness:
      </h2>
      <hr />
      <SurveyCategory title="Career Identity Confusion" preResults={preQ.data} postResults={postQ.data}
                      survey={CIDI_CAREER_IDENTITY_CONFUSION_SURVEY} />
      <SurveyCategory title="Career Exploration Breadth Self" preResults={preQ.data} postResults={postQ.data}
                      survey={CIDI_CAREER_EXPLORATION_BREADTH_SELF_SURVEY} />
      <SurveyCategory title="Career Past Exploration Breadth Self" preResults={preQ.data} postResults={postQ.data}
                      survey={CIDI_PAST_CAREER_EXPLORATION_BREADTH_SELF_SURVEY} />
      <SurveyCategory title="Career Exploration Depth Self" preResults={preQ.data} postResults={postQ.data}
                      survey={CIDI_CAREER_EXPLORATION_DEPTH_SELF_SURVEY} />
      <SurveyCategory title="Career Commitment Quality" preResults={preQ.data} postResults={postQ.data}
                      survey={CIDI_CAREER_COMMITMENT_QUALITY_SURVEY} />
    </div>
    <Link className="text-center w-full block" to="/offboarding/final-word-from-sam">A final word from Sam</Link>
  </div>;
}

