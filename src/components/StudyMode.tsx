import React, { useState } from 'react';
import { Flashcard } from '../types';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface StudyModeProps {
  flashcards: Flashcard[];
  onUpdateConfidence: (id: string, confidence: 'low' | 'medium' | 'high') => void;
}

export function StudyMode({ flashcards, onUpdateConfidence }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleConfidenceUpdate = (confidence: 'low' | 'medium' | 'high') => {
    onUpdateConfidence(currentCard.id, confidence);
    handleNext();
  };

  if (!currentCard) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-600">No flashcards to study!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`rounded-lg shadow-lg p-6 min-h-[300px] ${getGradientByCategory(currentCard.category)}`}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-white/80">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-sm bg-white/20 text-white font-medium backdrop-blur-sm">
            {currentCard.category}
          </span>
        </div>
        
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-medium mb-4 text-white">{currentCard.question}</h3>
            {showAnswer && (
              <p className="text-white/90 text-lg mt-4">{currentCard.answer}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-md hover:bg-white/30 transition-all duration-200"
            >
              Show Answer
            </button>
          ) : (
            <div className="space-x-4">
              <button
                onClick={() => handleConfidenceUpdate('low')}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-md hover:bg-white/30 transition-all duration-200"
              >
                Hard
              </button>
              <button
                onClick={() => handleConfidenceUpdate('medium')}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-md hover:bg-white/30 transition-all duration-200"
              >
                Medium
              </button>
              <button
                onClick={() => handleConfidenceUpdate('high')}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-md hover:bg-white/30 transition-all duration-200"
              >
                Easy
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/80 text-gray-700 hover:bg-white disabled:opacity-50 transition-all duration-200"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setShowAnswer(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/80 text-gray-700 hover:bg-white transition-all duration-200"
        >
          <RotateCcw size={20} />
          Restart
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/80 text-gray-700 hover:bg-white disabled:opacity-50 transition-all duration-200"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function getGradientByCategory(category: string): string {
  const gradients = {
    'Mathematics': 'bg-gradient-to-br from-blue-500 to-cyan-400',
    'Science': 'bg-gradient-to-br from-purple-500 to-pink-500',
    'History': 'bg-gradient-to-br from-amber-500 to-orange-400',
    'Languages': 'bg-gradient-to-br from-emerald-500 to-teal-400',
    'Other': 'bg-gradient-to-br from-slate-600 to-slate-500'
  };
  return gradients[category as keyof typeof gradients] || gradients.Other;
}