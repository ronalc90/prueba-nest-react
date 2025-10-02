interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

export const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-800 hover:text-red-900 font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
};
