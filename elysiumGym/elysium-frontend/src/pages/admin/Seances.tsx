import React from 'react';
import SeancesTable from '../../components/SeancesTable';

export default function SeancesPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#ffffff]">
      <div className="max-w-6xl mx-auto">
        <SeancesTable />
      </div>
    </div>
  );
}
