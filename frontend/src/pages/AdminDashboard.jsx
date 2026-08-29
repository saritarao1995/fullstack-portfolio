import PageHeader from '../components/layout/PageHeader';
import AdminDashboardContainer from '../containers/AdminDashboardContainer';
import WalletStatusContainer from '../containers/WalletStatusContainer';

const AdminDashboard = () => (
  <>
    <PageHeader
      title="Admin dashboard"
      description="Statistics are rebuilt from the contract's event log, so they reflect the chain rather than an application database."
    />

    <div className="flex flex-col gap-6">
      <WalletStatusContainer />
      <AdminDashboardContainer />
    </div>
  </>
);

export default AdminDashboard;
