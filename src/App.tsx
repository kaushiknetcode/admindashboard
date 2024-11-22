import React from 'react';
import { LoginForm } from './components/LoginForm';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/Layout/Navbar';
import { Dashboard } from './components/Dashboard/Dashboard';

function App() {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;