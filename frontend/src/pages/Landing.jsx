import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const Landing = () => (
  <div className="py-6">
    <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400">CertChain</p>
    <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
      Issue certificates that anyone can verify — without trusting a database.
    </h1>
    <p className="mt-5 max-w-2xl text-lg text-slate-400">
      An authorised institute writes the facts onto a smart contract. Employers check a certificate
      ID against the blockchain itself. No wallet is required to verify.
    </p>

    <div className="mt-8 flex flex-wrap gap-3">
      <Link to="/verify">
        <Button>Verify a certificate</Button>
      </Link>
      <Link to="/login">
        <Button variant="ghost">Institute login</Button>
      </Link>
    </div>

    <div className="mt-16 grid gap-4 sm:grid-cols-3">
      {[
        {
          title: 'On-chain proof',
          body: 'Student, course, issuer wallet and revoked flag live in the contract. They cannot be silently edited.',
        },
        {
          title: 'Off-chain convenience',
          body: 'PDFs, search and admin login stay in MongoDB. If the two disagree, the chain wins.',
        },
        {
          title: 'Public verification',
          body: 'A read from the contract is free and permissionless. MetaMask is only needed to issue or revoke.',
        },
      ].map((item) => (
        <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="font-semibold text-white">{item.title}</p>
          <p className="mt-2 text-sm text-slate-400">{item.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Landing;
