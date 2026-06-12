import React from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { MtechApplicationForm } from "./MtechApplicationForm";

const MtechApplicationModal = ({ open, onClose, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <MtechApplicationForm onSuccess={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default MtechApplicationModal;
