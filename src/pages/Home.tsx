/**
 * Home Page Component - Dashboard landing page
 * Simple welcome page without complex object rendering
 */

import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Global Cyber IT
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Enterprise Management System
        </p>
      </div>
    </div>
  );
}
