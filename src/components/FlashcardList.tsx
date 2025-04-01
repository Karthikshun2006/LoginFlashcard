import React, { useState } from 'react';
import { Flashcard } from '../types';
import { Edit, Trash2, ChevronDown } from 'lucide-react';

interface FlashcardListProps {
  flashcards: Flashcard[];
  onEdit: (card: Flashcard) => void;
  onDelete: (id: string) => void;
}

export function FlashcardList({ flashcards, onEdit, onDelete }: FlashcardListProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {flashcards.map((card) => {
        const isExpanded = expandedCards.has(card.id);
        return (
          <div
            key={card.id}
            className={`rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 ${getGradientByCategory(card.category)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="inline-block px-2 py-1 text-sm rounded-full bg-white/20 text-white font-medium backdrop-blur-sm">
                {card.category}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(card)}
                  className="text-white/70 hover:text-white transition-colors duration-200"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(card.id)}
                  className="text-white/70 hover:text-white transition-colors duration-200"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <button
              onClick={() => toggleCard(card.id)}
              className="w-full text-left group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-lg mb-2 text-white group-hover:text-white/90 transition-colors duration-200">
                  {card.question}
                </h3>
                <ChevronDown
                  size={20}
                  className={`text-white/70 mt-1 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-white/80 mt-2 pb-2">{card.answer}</p>
              </div>
            </button>
            <div className="mt-4 flex justify-between items-center text-sm text-white/60">
              <span>Confidence: {card.confidence}</span>
              <span>
                {card.lastReviewed
                  ? `Last reviewed: ${new Date(card.lastReviewed).toLocaleDateString()}`
                  : 'Not reviewed yet'}
              </span>
            </div>
          </div>
        );
      })}
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