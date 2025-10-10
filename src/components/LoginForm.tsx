import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { authFetch } from '@/lib/authFetch';
import { Eye, EyeOff } from 'lucide-react';
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Attempt login; authFetch will auto-refresh if needed (not applicable here but consistent API)
            const response = await authFetch(`${API_BASE}/api/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                // Clone response so we can read it multiple times if needed
                const clonedResponse = response.clone();
                let message = 'Login failed. Please check your credentials.';
                try {
                    const errorData = await response.json();
                    message = errorData.detail || JSON.stringify(errorData);
                } catch (_) {
                    try {
                        const text = await clonedResponse.text();
                        // Surface a concise snippet of any HTML/text error
                        message = text?.slice(0, 300) || message;
                    } catch {
                        // If both fail, use default message
                    }
                }
                throw new Error(message);
            }

            const data = await response.json();
            // Update global auth state (also persists to localStorage via AuthContext)
            login(data.access, data.refresh);
            
            // Notify the parent component that login was successful
            onLoginSuccess();

        } catch (err: any) {
            const msg = (err?.message || '').toString();
            // Provide extra hints for common network issues
            if (msg === 'Failed to fetch') {
                setError(`Failed to reach API at ${API_BASE}.\n` +
                  `Check that your backend is running and CORS/mixed content are not blocking the request.`);
            } else {
                setError(msg);
            }
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
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>
            <Button type="submit" className="w-full">Login</Button>
        </form>
    );
};

export default LoginForm;
