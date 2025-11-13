
import { TestAnswer, TestScore } from '../types';

export function calculateArchetypeResult(answers: TestAnswer[]): TestScore {
  const score: TestScore = {};

  answers.forEach((answer) => {
    answer.mapsTo.forEach((arch) => {
      if (!score[arch]) score[arch] = 0;
      score[arch] += 1;
    });
  });

  return score;
}

export function getTopArchetypes(score: TestScore): {
  primary: string;
  secondary: string;
} {
  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  if (sorted.length < 2) {
    // Handle cases with insufficient data, though unlikely with 30 questions
    return {
      primary: sorted[0]?.[0] || 'pleaser',
      secondary: sorted[0]?.[0] || 'achiever',
    };
  }
  return {
    primary: sorted[0][0],
    secondary: sorted[1][0]
  };
}
