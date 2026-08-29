import PageHeader from '../components/layout/PageHeader';
import VerifyContainer from '../containers/VerifyContainer';

const VerifyCertificate = () => (
  <>
    <PageHeader
      title="Certificate verification"
      description="Enter a certificate ID to check it against the on-chain registry. The result comes from the smart contract itself, not from any institution's database — and no wallet is required."
    />

    <div className="max-w-3xl">
      <VerifyContainer />
    </div>
  </>
);

export default VerifyCertificate;
