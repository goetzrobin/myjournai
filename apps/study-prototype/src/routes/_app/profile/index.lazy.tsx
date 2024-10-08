import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, useDarkMode } from '~myjournai/components';
import { useAuthUserIdFromHeaders, useSignOutMutation } from '~myjournai/auth-client';
import { useUserQuery } from '~myjournai/user-client';
import { WithMobileNav } from '../../-nav/with-mobile-nav';
import {
  useOnboardingProgressActions,
  useOnboardingSurveyActions,
  useOnboardingUserResetMutation
} from '~myjournai/onboarding-client';
import {
  useCidiPreCareerCommitmentQualitySurveyActions,
  useCidiPreCareerExplorationBreadthSelfSurveyActions,
  useCidiPreCareerExplorationDepthSelfSurveyActions,
  useCidiPreCareerIdentityConfusionSurveyActions,
  useCidiPrePastCareerExplorationBreadthSelfSurveyActions
} from '~myjournai/cidi-client';

export const Route = createLazyFileRoute('/_app/profile/')({
  component: () => {
    const userId = useAuthUserIdFromHeaders();
    const userQ = useUserQuery(userId);
    const signOutMut = useSignOutMutation();
    const nav = useNavigate();

    const pastBreadthActions = useCidiPrePastCareerExplorationBreadthSelfSurveyActions();
    const confusionActions = useCidiPreCareerIdentityConfusionSurveyActions();
    const depthActions = useCidiPreCareerExplorationDepthSelfSurveyActions();
    const breadthActions = useCidiPreCareerExplorationBreadthSelfSurveyActions();
    const qualityActions = useCidiPreCareerCommitmentQualitySurveyActions();
    const userActions = useOnboardingSurveyActions();
    const onboardingStepsActions = useOnboardingProgressActions();
    const mutation = useOnboardingUserResetMutation({ userId });
    const {theme, toggleDarkMode} = useDarkMode();

    const isJeffOrRobin = userQ.data?.username === 'jeff@neurotrainer.com' || userQ.data?.username === 'tug29225@temple.edu';

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
          <Button variant="secondary" className="w-full"
                  onPress={() => toggleDarkMode()}>Set theme to {theme === 'dark' ? 'light' : 'dark'}</Button>
          <Button className="w-full"
                  onPress={() => signOutMut.mutate(undefined, { onSuccess: () => nav({ to: '/sign-in' }) })}>Sign
            out</Button>
          {!isJeffOrRobin ? null : <Button variant="ghost" className="w-full"
                                           onPress={resetOnboarding}>Reset Onboarding</Button>}
        </div>
        <p className="text-center mt-4 text-muted-foreground text-xs">
          Version - {import.meta.env.VITE_APP_VERSION}
        </p>
      </div>
    </WithMobileNav>;
  }
});
