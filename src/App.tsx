import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Brain, List, PlusCircle, LogOut } from 'lucide-react';
import { Flashcard } from './types';
import { FlashcardList } from './components/FlashcardList';
import { FlashcardForm } from './components/FlashcardForm';
import { StudyMode } from './components/StudyMode';
import { SignUpForm } from './components/SignUpForm';
import { SignInForm } from './components/SignInForm';
import { useAuthStore } from './store/authStore';

type View = 'list' | 'create' | 'study';

function MainApp() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentView, setCurrentView] = useState<View>('list');
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const handleCreateCard = (card: Omit<Flashcard, 'id'>) => {
    const newCard: Flashcard = {
      ...card,
      id: crypto.randomUUID(),
      lastReviewed: undefined
    };
    setFlashcards([...flashcards, newCard]);
    setCurrentView('list');
  };

  const handleEditCard = (card: Flashcard) => {
    setEditingCard(card);
    setCurrentView('create');
  };

  const handleUpdateCard = (updatedCard: Omit<Flashcard, 'id'>) => {
    if (!editingCard) return;
    
    const updated = flashcards.map(card => 
      card.id === editingCard.id ? { ...updatedCard, id: card.id } : card
    );
    setFlashcards(updated);
    setEditingCard(null);
    setCurrentView('list');
  };

  const handleDeleteCard = (id: string) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
  };

  const handleUpdateConfidence = (id: string, confidence: 'low' | 'medium' | 'high') => {
    setFlashcards(flashcards.map(card =>
      card.id === id
        ? { ...card, confidence, lastReviewed: new Date() }
        : card
    ));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Flashcard Learning
            </h1>
            <div className="flex items-center gap-6">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    currentView === 'list'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <List size={20} />
                  All Cards
                </button>
                <button
                  onClick={() => {
                    setEditingCard(null);
                    setCurrentView('create');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    currentView === 'create'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <PlusCircle size={20} />
                  Create
                </button>
                <button
                  onClick={() => setCurrentView('study')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    currentView === 'study'
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Brain size={20} />
                  Study
                </button>
              </nav>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all duration-200"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'list' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Your Flashcards
              </h2>
              <button
                onClick={() => {
                  setEditingCard(null);
                  setCurrentView('create');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Create New Card
              </button>
            </div>
            <FlashcardList
              flashcards={flashcards}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
            />
          </>
        )}

        {currentView === 'create' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-6">
              {editingCard ? 'Edit Flashcard' : 'Create New Flashcard'}
            </h2>
            <FlashcardForm
              onSubmit={editingCard ? handleUpdateCard : handleCreateCard}
              initialValues={editingCard || undefined}
            />
          </div>
        )}

        {currentView === 'study' && (
          <StudyMode
            flashcards={flashcards}
            onUpdateConfidence={handleUpdateConfidence}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  const { loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/" element={<MainApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;