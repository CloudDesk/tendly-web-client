import { useState, KeyboardEvent } from 'react';
import axios from 'axios';
import { config } from '../config';


export default function SwipePage() {
  const [biometricId, setBiometricId] = useState('');
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSwipe = async () => {
    try {
      await axios.post(`${config.apiUrl}/biometric/swipe`, {
        biometricId,
        timestamp: new Date().toISOString(),
      });

      setStatus({ success: true, message: 'Swipe recorded successfully' });
      setBiometricId(''); // Clear input field
    } catch (error: any) {
      setStatus({
        success: false,
        message: error.response?.data?.error?.message || 'Failed to record swipe',
      });
    }

    // Clear status after 3 seconds
    setTimeout(() => {
      setStatus(null);
    }, 3000);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && biometricId.trim()) {
      handleSwipe();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Biometric Attendance
        </h1>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="biometricId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Swipe Card / Enter ID
            </label>
            <input
              type="text"
              id="biometricId"
              value={biometricId}
              onChange={(e) => setBiometricId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter biometric ID"
              autoFocus
            />
          </div>

          {status && (
            <div
              className={`p-4 rounded-md ${
                status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            onClick={handleSwipe}
            disabled={!biometricId.trim()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Record Swipe
          </button>
        </div>
      </div>
    </div>
  );
} 