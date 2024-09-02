/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthImport } from './routes/_auth'
import { Route as AppImport } from './routes/_app'
import { Route as PublicTermsImport } from './routes/_public/terms'
import { Route as PublicPrivacyPolicyImport } from './routes/_public/privacy-policy'
import { Route as AuthStartImport } from './routes/_auth/start'
import { Route as AuthSignUpImport } from './routes/_auth/sign-up'
import { Route as AuthSignInImport } from './routes/_auth/sign-in'
import { Route as AppResourcesImport } from './routes/_app/resources'
import { Route as AppOnboardingImport } from './routes/_app/onboarding'
import { Route as AppOnboardingSurveyIntroImport } from './routes/_app/onboarding/survey-intro'
import { Route as AppOnboardingStartImport } from './routes/_app/onboarding/start'
import { Route as AppOnboardingPronounsImport } from './routes/_app/onboarding/pronouns'
import { Route as AppOnboardingNameImport } from './routes/_app/onboarding/name'
import { Route as AppOnboardingMeetSamImport } from './routes/_app/onboarding/meet-sam'
import { Route as AppOnboardingBdayImport } from './routes/_app/onboarding/bday'
import { Route as AppSessionsAlignmentV0IndexImport } from './routes/_app/sessions/alignment-v0/index'
import { Route as AppOnboardingOneMoreThingIndexImport } from './routes/_app/onboarding/one-more-thing/index'
import { Route as AppOnboardingFinalConvoIndexImport } from './routes/_app/onboarding/final-convo/index'
import { Route as AppOnboardingStudyUserImport } from './routes/_app/onboarding/study/user'
import { Route as AppOnboardingStudyCompleteImport } from './routes/_app/onboarding/study/complete'
import { Route as AppOnboardingStudyPastCareerExplorationBreadthSelfSurveyImport } from './routes/_app/onboarding/study/past-career-exploration-breadth-self/survey'
import { Route as AppOnboardingStudyCareerIdentityConfusionSurveyImport } from './routes/_app/onboarding/study/career-identity-confusion/survey'
import { Route as AppOnboardingStudyCareerExplorationDepthSelfSurveyImport } from './routes/_app/onboarding/study/career-exploration-depth-self/survey'
import { Route as AppOnboardingStudyCareerExplorationBreadthSelfSurveyImport } from './routes/_app/onboarding/study/career-exploration-breadth-self/survey'
import { Route as AppOnboardingStudyCareerCommitmentQualitySurveyImport } from './routes/_app/onboarding/study/career-commitment-quality/survey'

// Create Virtual Routes

const AppIndexLazyImport = createFileRoute('/_app/')()

// Create/Update Routes

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AppRoute = AppImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexLazyRoute = AppIndexLazyImport.update({
  path: '/',
  getParentRoute: () => AppRoute,
} as any).lazy(() => import('./routes/_app/index.lazy').then((d) => d.Route))

const PublicTermsRoute = PublicTermsImport.update({
  path: '/terms',
  getParentRoute: () => rootRoute,
} as any)

const PublicPrivacyPolicyRoute = PublicPrivacyPolicyImport.update({
  path: '/privacy-policy',
  getParentRoute: () => rootRoute,
} as any)

const AuthStartRoute = AuthStartImport.update({
  path: '/start',
  getParentRoute: () => AuthRoute,
} as any)

const AuthSignUpRoute = AuthSignUpImport.update({
  path: '/sign-up',
  getParentRoute: () => AuthRoute,
} as any)

const AuthSignInRoute = AuthSignInImport.update({
  path: '/sign-in',
  getParentRoute: () => AuthRoute,
} as any)

const AppResourcesRoute = AppResourcesImport.update({
  path: '/resources',
  getParentRoute: () => AppRoute,
} as any)

const AppOnboardingRoute = AppOnboardingImport.update({
  path: '/onboarding',
  getParentRoute: () => AppRoute,
} as any)

const AppOnboardingSurveyIntroRoute = AppOnboardingSurveyIntroImport.update({
  path: '/survey-intro',
  getParentRoute: () => AppOnboardingRoute,
} as any)

const AppOnboardingStartRoute = AppOnboardingStartImport.update({
  path: '/start',
  getParentRoute: () => AppOnboardingRoute,
} as any)

const AppOnboardingPronounsRoute = AppOnboardingPronounsImport.update({
  path: '/pronouns',
  getParentRoute: () => AppOnboardingRoute,
} as any)

const AppOnboardingNameRoute = AppOnboardingNameImport.update({
  path: '/name',
  getParentRoute: () => AppOnboardingRoute,
} as any)

const AppOnboardingMeetSamRoute = AppOnboardingMeetSamImport.update({
  path: '/meet-sam',
  getParentRoute: () => AppOnboardingRoute,
} as any)

const AppOnboardingBdayRoute = AppOnboardingBdayImport.update({
  path: '/bday',
  getParentRoute: () => AppOnboardingRoute,
} as any)

const AppSessionsAlignmentV0IndexRoute =
  AppSessionsAlignmentV0IndexImport.update({
    path: '/sessions/alignment-v0/',
    getParentRoute: () => AppRoute,
  } as any)

const AppOnboardingOneMoreThingIndexRoute =
  AppOnboardingOneMoreThingIndexImport.update({
    path: '/one-more-thing/',
    getParentRoute: () => AppOnboardingRoute,
  } as any)

const AppOnboardingFinalConvoIndexRoute =
  AppOnboardingFinalConvoIndexImport.update({
    path: '/final-convo/',
    getParentRoute: () => AppOnboardingRoute,
  } as any)

const AppOnboardingStudyUserRoute = AppOnboardingStudyUserImport.update({
  path: '/study/user',
  getParentRoute: () => AppOnboardingRoute,
} as any)

const AppOnboardingStudyCompleteRoute = AppOnboardingStudyCompleteImport.update(
  {
    path: '/study/complete',
    getParentRoute: () => AppOnboardingRoute,
  } as any,
)

const AppOnboardingStudyPastCareerExplorationBreadthSelfSurveyRoute =
  AppOnboardingStudyPastCareerExplorationBreadthSelfSurveyImport.update({
    path: '/study/past-career-exploration-breadth-self/survey',
    getParentRoute: () => AppOnboardingRoute,
  } as any)

const AppOnboardingStudyCareerIdentityConfusionSurveyRoute =
  AppOnboardingStudyCareerIdentityConfusionSurveyImport.update({
    path: '/study/career-identity-confusion/survey',
    getParentRoute: () => AppOnboardingRoute,
  } as any)

const AppOnboardingStudyCareerExplorationDepthSelfSurveyRoute =
  AppOnboardingStudyCareerExplorationDepthSelfSurveyImport.update({
    path: '/study/career-exploration-depth-self/survey',
    getParentRoute: () => AppOnboardingRoute,
  } as any)

const AppOnboardingStudyCareerExplorationBreadthSelfSurveyRoute =
  AppOnboardingStudyCareerExplorationBreadthSelfSurveyImport.update({
    path: '/study/career-exploration-breadth-self/survey',
    getParentRoute: () => AppOnboardingRoute,
  } as any)

const AppOnboardingStudyCareerCommitmentQualitySurveyRoute =
  AppOnboardingStudyCareerCommitmentQualitySurveyImport.update({
    path: '/study/career-commitment-quality/survey',
    getParentRoute: () => AppOnboardingRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_app': {
      id: '/_app'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_app/onboarding': {
      id: '/_app/onboarding'
      path: '/onboarding'
      fullPath: '/onboarding'
      preLoaderRoute: typeof AppOnboardingImport
      parentRoute: typeof AppImport
    }
    '/_app/resources': {
      id: '/_app/resources'
      path: '/resources'
      fullPath: '/resources'
      preLoaderRoute: typeof AppResourcesImport
      parentRoute: typeof AppImport
    }
    '/_auth/sign-in': {
      id: '/_auth/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof AuthSignInImport
      parentRoute: typeof AuthImport
    }
    '/_auth/sign-up': {
      id: '/_auth/sign-up'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof AuthSignUpImport
      parentRoute: typeof AuthImport
    }
    '/_auth/start': {
      id: '/_auth/start'
      path: '/start'
      fullPath: '/start'
      preLoaderRoute: typeof AuthStartImport
      parentRoute: typeof AuthImport
    }
    '/_public/privacy-policy': {
      id: '/_public/privacy-policy'
      path: '/privacy-policy'
      fullPath: '/privacy-policy'
      preLoaderRoute: typeof PublicPrivacyPolicyImport
      parentRoute: typeof rootRoute
    }
    '/_public/terms': {
      id: '/_public/terms'
      path: '/terms'
      fullPath: '/terms'
      preLoaderRoute: typeof PublicTermsImport
      parentRoute: typeof rootRoute
    }
    '/_app/': {
      id: '/_app/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AppIndexLazyImport
      parentRoute: typeof AppImport
    }
    '/_app/onboarding/bday': {
      id: '/_app/onboarding/bday'
      path: '/bday'
      fullPath: '/onboarding/bday'
      preLoaderRoute: typeof AppOnboardingBdayImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/meet-sam': {
      id: '/_app/onboarding/meet-sam'
      path: '/meet-sam'
      fullPath: '/onboarding/meet-sam'
      preLoaderRoute: typeof AppOnboardingMeetSamImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/name': {
      id: '/_app/onboarding/name'
      path: '/name'
      fullPath: '/onboarding/name'
      preLoaderRoute: typeof AppOnboardingNameImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/pronouns': {
      id: '/_app/onboarding/pronouns'
      path: '/pronouns'
      fullPath: '/onboarding/pronouns'
      preLoaderRoute: typeof AppOnboardingPronounsImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/start': {
      id: '/_app/onboarding/start'
      path: '/start'
      fullPath: '/onboarding/start'
      preLoaderRoute: typeof AppOnboardingStartImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/survey-intro': {
      id: '/_app/onboarding/survey-intro'
      path: '/survey-intro'
      fullPath: '/onboarding/survey-intro'
      preLoaderRoute: typeof AppOnboardingSurveyIntroImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/study/complete': {
      id: '/_app/onboarding/study/complete'
      path: '/study/complete'
      fullPath: '/onboarding/study/complete'
      preLoaderRoute: typeof AppOnboardingStudyCompleteImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/study/user': {
      id: '/_app/onboarding/study/user'
      path: '/study/user'
      fullPath: '/onboarding/study/user'
      preLoaderRoute: typeof AppOnboardingStudyUserImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/final-convo/': {
      id: '/_app/onboarding/final-convo/'
      path: '/final-convo'
      fullPath: '/onboarding/final-convo'
      preLoaderRoute: typeof AppOnboardingFinalConvoIndexImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/one-more-thing/': {
      id: '/_app/onboarding/one-more-thing/'
      path: '/one-more-thing'
      fullPath: '/onboarding/one-more-thing'
      preLoaderRoute: typeof AppOnboardingOneMoreThingIndexImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/sessions/alignment-v0/': {
      id: '/_app/sessions/alignment-v0/'
      path: '/sessions/alignment-v0'
      fullPath: '/sessions/alignment-v0'
      preLoaderRoute: typeof AppSessionsAlignmentV0IndexImport
      parentRoute: typeof AppImport
    }
    '/_app/onboarding/study/career-commitment-quality/survey': {
      id: '/_app/onboarding/study/career-commitment-quality/survey'
      path: '/study/career-commitment-quality/survey'
      fullPath: '/onboarding/study/career-commitment-quality/survey'
      preLoaderRoute: typeof AppOnboardingStudyCareerCommitmentQualitySurveyImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/study/career-exploration-breadth-self/survey': {
      id: '/_app/onboarding/study/career-exploration-breadth-self/survey'
      path: '/study/career-exploration-breadth-self/survey'
      fullPath: '/onboarding/study/career-exploration-breadth-self/survey'
      preLoaderRoute: typeof AppOnboardingStudyCareerExplorationBreadthSelfSurveyImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/study/career-exploration-depth-self/survey': {
      id: '/_app/onboarding/study/career-exploration-depth-self/survey'
      path: '/study/career-exploration-depth-self/survey'
      fullPath: '/onboarding/study/career-exploration-depth-self/survey'
      preLoaderRoute: typeof AppOnboardingStudyCareerExplorationDepthSelfSurveyImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/study/career-identity-confusion/survey': {
      id: '/_app/onboarding/study/career-identity-confusion/survey'
      path: '/study/career-identity-confusion/survey'
      fullPath: '/onboarding/study/career-identity-confusion/survey'
      preLoaderRoute: typeof AppOnboardingStudyCareerIdentityConfusionSurveyImport
      parentRoute: typeof AppOnboardingImport
    }
    '/_app/onboarding/study/past-career-exploration-breadth-self/survey': {
      id: '/_app/onboarding/study/past-career-exploration-breadth-self/survey'
      path: '/study/past-career-exploration-breadth-self/survey'
      fullPath: '/onboarding/study/past-career-exploration-breadth-self/survey'
      preLoaderRoute: typeof AppOnboardingStudyPastCareerExplorationBreadthSelfSurveyImport
      parentRoute: typeof AppOnboardingImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AppRoute: AppRoute.addChildren({
    AppOnboardingRoute: AppOnboardingRoute.addChildren({
      AppOnboardingBdayRoute,
      AppOnboardingMeetSamRoute,
      AppOnboardingNameRoute,
      AppOnboardingPronounsRoute,
      AppOnboardingStartRoute,
      AppOnboardingSurveyIntroRoute,
      AppOnboardingStudyCompleteRoute,
      AppOnboardingStudyUserRoute,
      AppOnboardingFinalConvoIndexRoute,
      AppOnboardingOneMoreThingIndexRoute,
      AppOnboardingStudyCareerCommitmentQualitySurveyRoute,
      AppOnboardingStudyCareerExplorationBreadthSelfSurveyRoute,
      AppOnboardingStudyCareerExplorationDepthSelfSurveyRoute,
      AppOnboardingStudyCareerIdentityConfusionSurveyRoute,
      AppOnboardingStudyPastCareerExplorationBreadthSelfSurveyRoute,
    }),
    AppResourcesRoute,
    AppIndexLazyRoute,
    AppSessionsAlignmentV0IndexRoute,
  }),
  AuthRoute: AuthRoute.addChildren({
    AuthSignInRoute,
    AuthSignUpRoute,
    AuthStartRoute,
  }),
  PublicPrivacyPolicyRoute,
  PublicTermsRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_app",
        "/_auth",
        "/_public/privacy-policy",
        "/_public/terms"
      ]
    },
    "/_app": {
      "filePath": "_app.tsx",
      "children": [
        "/_app/onboarding",
        "/_app/resources",
        "/_app/",
        "/_app/sessions/alignment-v0/"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/sign-in",
        "/_auth/sign-up",
        "/_auth/start"
      ]
    },
    "/_app/onboarding": {
      "filePath": "_app/onboarding.tsx",
      "parent": "/_app",
      "children": [
        "/_app/onboarding/bday",
        "/_app/onboarding/meet-sam",
        "/_app/onboarding/name",
        "/_app/onboarding/pronouns",
        "/_app/onboarding/start",
        "/_app/onboarding/survey-intro",
        "/_app/onboarding/study/complete",
        "/_app/onboarding/study/user",
        "/_app/onboarding/final-convo/",
        "/_app/onboarding/one-more-thing/",
        "/_app/onboarding/study/career-commitment-quality/survey",
        "/_app/onboarding/study/career-exploration-breadth-self/survey",
        "/_app/onboarding/study/career-exploration-depth-self/survey",
        "/_app/onboarding/study/career-identity-confusion/survey",
        "/_app/onboarding/study/past-career-exploration-breadth-self/survey"
      ]
    },
    "/_app/resources": {
      "filePath": "_app/resources.tsx",
      "parent": "/_app"
    },
    "/_auth/sign-in": {
      "filePath": "_auth/sign-in.tsx",
      "parent": "/_auth"
    },
    "/_auth/sign-up": {
      "filePath": "_auth/sign-up.tsx",
      "parent": "/_auth"
    },
    "/_auth/start": {
      "filePath": "_auth/start.tsx",
      "parent": "/_auth"
    },
    "/_public/privacy-policy": {
      "filePath": "_public/privacy-policy.tsx"
    },
    "/_public/terms": {
      "filePath": "_public/terms.tsx"
    },
    "/_app/": {
      "filePath": "_app/index.lazy.tsx",
      "parent": "/_app"
    },
    "/_app/onboarding/bday": {
      "filePath": "_app/onboarding/bday.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/meet-sam": {
      "filePath": "_app/onboarding/meet-sam.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/name": {
      "filePath": "_app/onboarding/name.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/pronouns": {
      "filePath": "_app/onboarding/pronouns.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/start": {
      "filePath": "_app/onboarding/start.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/survey-intro": {
      "filePath": "_app/onboarding/survey-intro.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/study/complete": {
      "filePath": "_app/onboarding/study/complete.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/study/user": {
      "filePath": "_app/onboarding/study/user.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/final-convo/": {
      "filePath": "_app/onboarding/final-convo/index.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/one-more-thing/": {
      "filePath": "_app/onboarding/one-more-thing/index.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/sessions/alignment-v0/": {
      "filePath": "_app/sessions/alignment-v0/index.tsx",
      "parent": "/_app"
    },
    "/_app/onboarding/study/career-commitment-quality/survey": {
      "filePath": "_app/onboarding/study/career-commitment-quality/survey.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/study/career-exploration-breadth-self/survey": {
      "filePath": "_app/onboarding/study/career-exploration-breadth-self/survey.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/study/career-exploration-depth-self/survey": {
      "filePath": "_app/onboarding/study/career-exploration-depth-self/survey.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/study/career-identity-confusion/survey": {
      "filePath": "_app/onboarding/study/career-identity-confusion/survey.tsx",
      "parent": "/_app/onboarding"
    },
    "/_app/onboarding/study/past-career-exploration-breadth-self/survey": {
      "filePath": "_app/onboarding/study/past-career-exploration-breadth-self/survey.tsx",
      "parent": "/_app/onboarding"
    }
  }
}
ROUTE_MANIFEST_END */
