import Card from "../ui/Card";
import Button from "../ui/Button";

function DeleteTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-white">
          Delete Transaction
        </h2>

        <p className="mt-4 text-slate-400">
          Are you sure you want to delete this transaction?
        </p>

        <p className="mt-2 text-sm text-red-400">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex gap-4">
          <Button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="bg-slate-700 hover:bg-slate-600"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            loading={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default DeleteTransactionModal;