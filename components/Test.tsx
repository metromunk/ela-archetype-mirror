
import React, { useState } from 'react';
import { ArchetypeTestQuestion, ArchetypeResult, TestAnswer } from '../types';
import { calculateArchetypeResult, getTopArchetypes } from '../utils/scoring';

interface TestProps {
  questions: ArchetypeTestQuestion[];
  onComplete: (result: ArchetypeResult) => void;
}

const Test: React.FC<TestProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption !== null) {
      const currentQuestion = questions[currentQuestionIndex];
      const answer = currentQuestion.options.find(opt => opt.id === selectedOption);
      if (answer) {
        const newAnswers = [...answers, { optionId: answer.id, mapsTo: answer.mapsTo }];
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption(null);
        } else {
          // Test complete
          const score = calculateArchetypeResult(newAnswers);
          const { primary, secondary } = getTopArchetypes(score);
          const result: ArchetypeResult = {
            primaryMaskId: primary,
            secondaryMaskId: secondary,
            // We'll calculate the chakras on the results page from the archetype data
            chakra: [], 
          };
          onComplete(result);
        }
      }
    }
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-foreground">Question {currentQuestionIndex + 1}/{questions.length}</h2>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-lg shadow-md">
        <h3 className="text-xl md:text-2xl font-serif font-medium text-card-foreground mb-6">{currentQuestion.question}</h3>
        <div className="space-y-4">
          {currentQuestion.options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedOption === option.id
                  ? 'bg-secondary border-primary ring-2 ring-primary'
                  : 'bg-background border-border hover:border-secondary-foreground'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                className="h-5 w-5 text-primary focus:ring-primary border-muted-foreground mr-4"
              />
              <span className="text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!selectedOption}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-2 px-6 rounded-lg shadow-md transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default Test;
