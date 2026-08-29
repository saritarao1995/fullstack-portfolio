import Button from '../ui/Button';
import CustomSettingsRow from './CustomSettingsRow';

const CustomSettingsList = ({ items, onKey, onValue, onAdd, onRemove }) => (
  <div className="space-y-3">
    <p className="text-sm text-ink-soft">
      Extra keys for later integrations (webhooks, extra gateways). Saved with the company
      settings.
    </p>
    {items.map((item) => (
      <CustomSettingsRow
        key={item.id}
        item={item}
        onKey={onKey}
        onValue={onValue}
        onRemove={onRemove}
      />
    ))}
    <Button type="button" variant="ghost" onClick={onAdd}>
      Add setting
    </Button>
  </div>
);

export default CustomSettingsList;
