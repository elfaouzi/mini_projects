import React from 'react';
import PaymentsTable from '../../components/PaymentsTable';

export default function PaymentsPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#ffffff]">
      <div className="max-w-6xl mx-auto">
        <PaymentsTable />
      </div>
    </div>
  );
}
