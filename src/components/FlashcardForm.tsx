import React, { useState } from 'react';
import { Flashcard } from '../types';

interface FlashcardFormProps {
  onSubmit: (card: Omit<Flashcard, 'id'>) => void;
  initialValues?: Flashcard;
}

export function FlashcardForm({ onSubmit, initialValues }: FlashcardFormProps) {
  const [formData, setFormData] = useState({
    question: initialValues?.question || '',
    answer: initialValues?.answer || '',
    category: initialValues?.category || 'Other',
    confidence: initialValues?.confidence || 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      confidence: formData.confidence as 'low' | 'medium' | 'high'
    });
    if (!initialValues) {
      setFormData({
        question: '',
        answer: '',
        category: 'Other',
        confidence: 'medium'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-1">
              Question
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-200 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-1">
              Answer
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-200 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-200 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Languages">Languages</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-1">
              Confidence Level
            </label>
            <select
              value={formData.confidence}
              onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-200 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
      >
        {initialValues ? 'Update Flashcard' : 'Create Flashcard'}
      </button>
    </form>
  );
}