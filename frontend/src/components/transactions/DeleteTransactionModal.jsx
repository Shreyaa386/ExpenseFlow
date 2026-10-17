import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { AlertTriangle } from "lucide-react";

function DeleteTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Transaction"
      description="Verify deletion before permanent removal from ledger."
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#D9573B]/30 bg-[#D9573B]/10 p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-[#D9573B] shrink-0 mt-0.5" />
          <div className="text-xs text-[#D9573B] leading-relaxed">
            <p className="font-bold text-[#D9573B]">Irreversible Action</p>
            <p className="mt-1 text-[#66736E]">
              Are you sure you want to delete this transaction? This entry will be permanently removed from your historical ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E7DE]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            loading={loading}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteTransactionModal;