export type DisclaimerDialogProps = {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  loading?: boolean;
};

export type CheckboxItem = {
  id: string;
  checked: boolean;
  description: string;
};
