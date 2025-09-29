import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Use the correct API URL from your backend
            const response = await fetch(`${API_BASE}/api/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                // Try JSON first; if it fails (e.g., HTML error page), fall back to text
                let message = 'Login failed. Please check your credentials.';
                try {
                    const errorData = await response.json();
                    message = errorData.detail || JSON.stringify(errorData);
                } catch (_) {
                    const text = await response.text();
                    // Surface a concise snippet of any HTML/text error
                    message = text?.slice(0, 300) || message;
                }
                throw new Error(message);
            }

            const data = await response.json();
            // Update global auth state (also persists to localStorage via AuthContext)
            login(data.access, data.refresh);
            
            // Notify the parent component that login was successful
            onLoginSuccess();

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">Login</h2>
            {error && <p className="text-sm text-red-500 whitespace-pre-wrap">{error}</p>}
            <div className="space-y-1">
                <label htmlFor="login-username" className="text-sm">Username</label>
                <Input
                    type="text"
                    id="login-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                />
            </div>
            <div className="space-y-1">
                <label htmlFor="login-password" className="text-sm">Password</label>
                <Input
                    type="password"
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                />
            </div>
            <Button type="submit" className="w-full">Login</Button>
        </form>
    );
};

export default LoginForm;
