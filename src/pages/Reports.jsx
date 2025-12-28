import React from 'react';

export default function Reports() {
  return (
    <main className="flex-1 w-full flex flex-col bg-white-light overflow-y-auto">
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-outfit font-700 text-black-dark mb-2">
            Reports
          </h1>
          <p className="font-jakarta text-grey-mid">View your performance reports</p>
        </div>

        <div className="bg-white-darkest rounded-xl p-8 border border-grey-lightest">
          <p className="font-jakarta text-grey-mid">Reports content coming soon...</p>
        </div>
      </div>
    </main>
  );
}
