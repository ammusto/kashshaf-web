interface SpinnerProps {
  label?: string;
}

const Spinner = ({ label }: SpinnerProps) => {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
};

export default Spinner;
