const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => {
  const styles = {
    primary:
      'bg-clay text-parchment hover:bg-clay-deep disabled:opacity-60',
    dark: 'bg-ink text-parchment hover:bg-ink-soft disabled:opacity-60',
    ghost:
      'border border-ink/15 bg-transparent text-ink hover:border-ink/40 disabled:opacity-60',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-wide transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
