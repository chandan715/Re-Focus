import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      {showLogin ? (
        <>
          <LoginForm onLoginSuccess={onLoginSuccess} />
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            Don't have an account?{' '}
            <button onClick={() => setShowLogin(false)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}>
              Sign Up
            </button>
          </p>
        </>
      ) : (
        <>
          <SignupForm />
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            Already have an account?{' '}
            <button onClick={() => setShowLogin(true)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}>
              Log In
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default AuthPage;
