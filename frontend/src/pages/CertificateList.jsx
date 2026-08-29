import PageHeader from '../components/layout/PageHeader';
import CertificateListContainer from '../containers/CertificateListContainer';
import WalletStatusContainer from '../containers/WalletStatusContainer';

const CertificateList = () => (
  <>
    <PageHeader
      title="Issued certificates"
      description="The contract has no function that lists certificates — mappings cannot be iterated. This table is reconstructed from CertificateIssued and CertificateRevoked events."
    />

    <div className="flex flex-col gap-6">
      <WalletStatusContainer />
      <CertificateListContainer />
    </div>
  </>
);

export default CertificateList;
