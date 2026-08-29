import PageHeader from '../components/layout/PageHeader';
import IssueCertificateContainer from '../containers/IssueCertificateContainer';
import WalletStatusContainer from '../containers/WalletStatusContainer';

const IssueCertificate = () => (
  <>
    <PageHeader
      title="Issue certificate"
      description="This writes to the blockchain. MetaMask will ask you to sign, the network charges gas, and the record can never be edited or deleted afterwards."
    />

    <div className="flex max-w-2xl flex-col gap-6">
      <WalletStatusContainer />
      <IssueCertificateContainer />
    </div>
  </>
);

export default IssueCertificate;
