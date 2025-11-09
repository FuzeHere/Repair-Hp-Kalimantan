
import React, { useState } from 'react';
import { DevicePhoneMobileIcon } from './icons';

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface/60 backdrop-blur-lg shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4 border border-white/10">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary p-3 rounded-full mb-3">
              <DevicePhoneMobileIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Repair HP Kalimantan</h1>
            <p className="text-text-secondary">Silakan login untuk melanjutkan</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4 bg-background/70 text-text-primary leading-tight focus:outline-none focus:shadow-outline focus:border-accent"
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4 bg-background/70 text-text-primary mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-accent"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-accent hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition duration-300"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-gray-500 text-xs">
          &copy;2024 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;