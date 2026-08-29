const channelLabel = (item) => {
  if (item.channel === 'sms') return 'SMS';
  if (item.channel === 'whatsapp') return 'WhatsApp';
  return 'Email';
};

const NotificationLog = ({ entries }) => {
  if (!entries.length) {
    return <p className="text-sm text-ink-soft">No messages yet. Ship an order to see a log.</p>;
  }

  return (
    <ul className="space-y-3">
      {entries.map((item, index) => (
        <li
          key={`${item.at}-${item.orderId}-${index}`}
          className="rounded-2xl bg-sand px-4 py-3 text-sm"
        >
          <p className="font-medium text-ink">
            {channelLabel(item)} · {item.to} · {item.orderId}
          </p>
          {item.from ? (
            <p className="mt-1 text-xs text-ink-soft">From {item.from}</p>
          ) : null}
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-soft">
            {item.event} · {item.demo ? 'demo' : item.provider || 'sent'}
          </p>
          {item.subject ? <p className="mt-2 text-ink-soft">{item.subject}</p> : null}
          <p className="mt-1 whitespace-pre-wrap text-ink-soft">{item.body}</p>
        </li>
      ))}
    </ul>
  );
};

export default NotificationLog;
