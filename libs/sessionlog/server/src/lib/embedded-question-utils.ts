import { SessionLog } from '~myjournai/sessionlog-shared';

// Utility function to map scores to descriptive responses
const scoreToFeelingText = (score: number | null): string => {
  switch (score) {
    case 1: return "Awful";
    case 2: return "Meh";
    case 3: return "Good";
    case 4: return "Great";
    default: return "Unknown";
  }
};

const scoreToMotivationText = (score: number | null): string => {
  switch (score) {
    case 1: return "Not at all motivated";
    case 2: return "Slightly motivated";
    case 3: return "Quite motivated";
    case 4: return "Highly motivated";
    default: return "Unknown";
  }
};

const scoreToAnxietyText = (score: number | null): string => {
  switch (score) {
    case 1: return "Not at all anxious";
    case 2: return "Slightly anxious";
    case 3: return "Quite anxious";
    case 4: return "Extremely anxious";
    default: return "Unknown";
  }
};

// Main utility function to create the embedded questions block
export const createEmbeddedQuestionsBlock = (
  sessionLog: SessionLog,
  usePostScores = false
): string => {
  // Determine whether to use pre or post session scores based on the flag
  const feelingScore = usePostScores ? sessionLog.postFeelingScore : sessionLog.preFeelingScore;
  const motivationScore = usePostScores ? sessionLog.postMotivationScore : sessionLog.preMotivationScore;
  const anxietyScore = usePostScores ? sessionLog.postAnxietyScore : sessionLog.preAnxietyScore;

  // Generate text block using the mapped scores
  return `
  How are you feeling right now? ${scoreToFeelingText(feelingScore)}

  How motivated do you feel right now? ${scoreToMotivationText(motivationScore)}

  Do you feel anxious right now? ${scoreToAnxietyText(anxietyScore)}
  `;
};
