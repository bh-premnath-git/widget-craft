import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-dashboard-bg">
      <DashboardHeader />
      <div className="p-6">
        <DashboardGrid />
      </div>
    </div>
  );
};

export default Index;
