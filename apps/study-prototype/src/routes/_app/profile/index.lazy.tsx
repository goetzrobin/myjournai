import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '~myjournai/components';
import { useAuthUserIdFromHeaders, useSignOutMutation } from '@myjournai/auth-client';
import { useUserQuery } from '@myjournai/user-client';
import { WithMobileNav } from '../../-nav/with-mobile-nav';
import {
  useOnbCidiCareerCommitmentQualitySurveyActions,
  useOnbCidiCareerExplorationBreadthSelfSurveyActions,
  useOnbCidiCareerExplorationDepthSelfSurveyActions,
  useOnbCidiCareerIdentityConfusionSurveyActions,
  useOnbCidiPastCareerExplorationBreadthSelfSurveyActions,
  useOnboardingProgressActions,
  useOnboardingSurveyActions,
  useOnboardingUserResetMutation
} from '~myjournai/onboarding-client';

export const Route = createLazyFileRoute('/_app/profile/')({
  component: () => {
    const userId = useAuthUserIdFromHeaders();
    const userQ = useUserQuery(userId);
    const signOutMut = useSignOutMutation();
    const nav = useNavigate();

    const pastBreadthActions = useOnbCidiPastCareerExplorationBreadthSelfSurveyActions();
    const confusionActions = useOnbCidiCareerIdentityConfusionSurveyActions();
    const depthActions = useOnbCidiCareerExplorationDepthSelfSurveyActions();
    const breadthActions = useOnbCidiCareerExplorationBreadthSelfSurveyActions();
    const qualityActions = useOnbCidiCareerCommitmentQualitySurveyActions();
    const userActions = useOnboardingSurveyActions();
    const onboardingStepsActions = useOnboardingProgressActions();
    const mutation = useOnboardingUserResetMutation({ userId });

    const resetOnboarding = () => {
      pastBreadthActions.reset();
      confusionActions.reset();
      depthActions.reset();
      breadthActions.reset();
      qualityActions.reset();
      userActions.reset();
      onboardingStepsActions.reset();

      mutation.mutate(undefined, {
        onSuccess: () => nav({ to: '/onboarding' })
      });
    };


    return <WithMobileNav>
      <div className="p-4">
        <h1 className="text-xl">{userQ.data?.name}</h1>
        <div className="py-8 space-y-4">
          <Button className="w-full"
                  onPress={() => signOutMut.mutate(undefined, { onSuccess: () => nav({ to: '/sign-in' }) })}>Sign
            out</Button>
          <Button variant="ghost" className="w-full"
                  onPress={resetOnboarding}>Reset Onboarding</Button>
        </div>
        <p className="text-center mt-4 text-muted-foreground text-xs">
          Version - {import.meta.env.VITE_APP_VERSION}
        </p>
      </div>
    </WithMobileNav>;
  }
});
