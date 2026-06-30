import React from 'react';
import Layout from './components/Layout';
import KPICards from './components/KPICards';
import DashboardCharts from './components/DashboardCharts';
import DataTable from './components/DataTable';
import mockData from './data/mockData.json';

function App() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* KPI Section */}
        <section>
          <KPICards data={mockData} />
        </section>

        {/* Charts Section */}
        <section>
          <DashboardCharts data={mockData} />
        </section>

        {/* Table Section */}
        <section>
          <DataTable data={mockData} />
        </section>
      </div>
    </Layout>
  );
}

export default App;
