import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import CompanySettingsForm from '../components/admin/CompanySettingsForm';
import PaymentSettingsForm from '../components/admin/PaymentSettingsForm';
import NotifySettingsForm from '../components/admin/NotifySettingsForm';
import CustomSettingsList from '../components/admin/CustomSettingsList';
import NotificationLog from '../components/admin/NotificationLog';
import {
  selectNoticeLog,
  selectSettings,
  selectSettingsError,
  selectSettingsStatus,
} from '../store/selectors/settingsSelectors';
import { loadNoticeLog, saveSettings } from '../store/thunks/settingsThunks';
import { uploadImage } from '../services/uploadService';

const TITLES = {
  company: 'Company',
  payments: 'Payments',
  alerts: 'Email, SMS & WhatsApp',
  keys: 'Dynamic keys',
};

const AdminSettingsContainer = () => {
  const dispatch = useDispatch();
  const { section } = useParams();
  const saved = useSelector(selectSettings);
  const status = useSelector(selectSettingsStatus);
  const error = useSelector(selectSettingsError);
  const log = useSelector(selectNoticeLog);
  const [form, setForm] = useState({
    company: saved.company,
    payments: saved.payments,
    notifications: saved.notifications,
    custom: saved.custom,
  });
  const [pickBusy, setPickBusy] = useState('');
  const [pickError, setPickError] = useState('');

  useEffect(() => {
    dispatch(loadNoticeLog());
  }, [dispatch]);

  useEffect(() => {
    setForm({
      company: saved.company,
      payments: saved.payments,
      notifications: saved.notifications,
      custom: saved.custom,
    });
  }, [saved.company, saved.payments, saved.notifications, saved.custom]);

  const handleCompany = (field, value) => {
    setPickError('');
    setForm((current) => ({
      ...current,
      company: { ...current.company, [field]: value },
    }));
  };

  const pickCompanyImage = async (field, file) => {
    setPickError('');
    setPickBusy(field === 'heroImage' ? 'hero' : 'logo');
    try {
      const url = await uploadImage(file);
      handleCompany(field, url);
    } catch (err) {
      setPickError(err.message || 'Could not upload that photo.');
    } finally {
      setPickBusy('');
    }
  };

  const handlePickLogo = (file) => {
    pickCompanyImage('logo', file);
  };

  const handlePickHero = (file) => {
    pickCompanyImage('heroImage', file);
  };

  const handlePayments = (field, value) => {
    setForm((current) => ({
      ...current,
      payments: {
        ...current.payments,
        [field]: value,
      },
    }));
  };

  const handleNotifications = (field, value) => {
    setForm((current) => ({
      ...current,
      notifications: { ...current.notifications, [field]: value },
    }));
  };

  const handleCustomKey = (id, value) => {
    setForm((current) => ({
      ...current,
      custom: current.custom.map((item) => (item.id === id ? { ...item, key: value } : item)),
    }));
  };

  const handleCustomValue = (id, value) => {
    setForm((current) => ({
      ...current,
      custom: current.custom.map((item) => (item.id === id ? { ...item, value } : item)),
    }));
  };

  const handleCustomAdd = () => {
    setForm((current) => ({
      ...current,
      custom: [...current.custom, { id: `k-${Date.now()}`, key: '', value: '' }],
    }));
  };

  const handleCustomRemove = (id) => {
    setForm((current) => ({
      ...current,
      custom: current.custom.filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(saveSettings(form));
  };

  if (!TITLES[section]) {
    return <Navigate to="/studio/settings/company" replace />;
  }

  return (
    <section className="px-6 py-10 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-clay">House</p>
      <h1 className="mt-2 font-display text-4xl">{TITLES[section]}</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        {section === 'company'
          ? 'Shop name, logo, and homepage photo. Hit Save — the storefront updates at once.'
          : 'Use Settings in the sidebar to switch company, payments, and alerts.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-10 max-w-3xl space-y-10">
        {section === 'company' ? (
          <CompanySettingsForm
            company={form.company}
            pickBusy={pickBusy}
            onChange={handleCompany}
            onPickLogo={handlePickLogo}
            onPickHero={handlePickHero}
          />
        ) : null}
        {section === 'payments' ? (
          <PaymentSettingsForm payments={form.payments} onChange={handlePayments} />
        ) : null}
        {section === 'alerts' ? (
          <NotifySettingsForm notifications={form.notifications} onChange={handleNotifications} />
        ) : null}
        {section === 'keys' ? (
          <CustomSettingsList
            items={form.custom ?? []}
            onKey={handleCustomKey}
            onValue={handleCustomValue}
            onAdd={handleCustomAdd}
            onRemove={handleCustomRemove}
          />
        ) : null}

        {pickError || error ? <p className="text-sm text-clay-deep">{pickError || error}</p> : null}

        <Button type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : `Save ${TITLES[section].toLowerCase()}`}
        </Button>
      </form>

      {section === 'alerts' ? (
        <div className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl">Message log</h2>
          <p className="mt-2 text-sm text-ink-soft">Last alerts sent to customers from this studio.</p>
          <div className="mt-4">
            <NotificationLog entries={log.length ? log : []} />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default AdminSettingsContainer;
