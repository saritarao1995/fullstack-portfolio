import DeliveryOption from './DeliveryOption';

const DeliveryOptions = ({ options, selectedId, onSelect }) => (
  <div className="space-y-3">
    <p className="text-sm font-medium">How should it reach you?</p>
    {options.map((option) => (
      <DeliveryOption
        key={option.id}
        option={option}
        selected={selectedId === option.id}
        onSelect={onSelect}
      />
    ))}
  </div>
);

export default DeliveryOptions;
