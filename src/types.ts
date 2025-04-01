export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  lastReviewed?: Date;
  confidence: 'low' | 'medium' | 'high';
  category: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}