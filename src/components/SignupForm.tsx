import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const SignupForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_BASE}/api/users/create/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                // Try JSON first; if HTML/text, fall back to text to avoid JSON parse errors
                let message = 'Signup failed.';
                try {
                    const errorData = await response.json();
                    if (errorData && typeof errorData === 'object') {
                        const errorMessages = Object.entries(errorData).map(([key, value]) => `${key}: ${value as any}`).join('\n');
                        message = errorMessages || message;
                    }
                } catch (_) {
                    const text = await response.text();
                    message = text?.slice(0, 300) || message;
                }
                throw new Error(message);
            }
            
            setSuccess('Account created successfully! You can now log in.');
            // Clear form
            setUsername('');
            setEmail('');
            setPassword('');

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">Sign Up</h2>
            {error && <pre className="text-sm text-red-500 whitespace-pre-wrap">{error}</pre>}
            {success && <p className="text-sm text-green-500">{success}</p>}
            <div className="space-y-1">
                <label htmlFor="signup-username" className="text-sm">Username</label>
                <Input
                    type="text"
                    id="signup-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Choose a username"
                />
            </div>
            <div className="space-y-1">
                <label htmlFor="signup-email" className="text-sm">Email</label>
                <Input
                    type="email"
                    id="signup-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                />
            </div>
            <div className="space-y-1">
                <label htmlFor="signup-password" className="text-sm">Password</label>
                <Input
                    type="password"
                    id="signup-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                />
            </div>
            <Button type="submit" className="w-full">Create Account</Button>
        </form>
    );
};

export default SignupForm;
