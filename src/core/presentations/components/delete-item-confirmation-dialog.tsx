import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { DangerButton } from "@/core/presentations/components/buttons/danger-button";

type DeleteItemConfirmationDialogProps = {
  open: boolean;
  onClose?: () => void;
  onSubmit?: (args: { index: number }) => void | Promise<void>;
  data: { name: string };
  dataIndex: number;
};

export function DeleteItemConfirmationDialog(props: DeleteItemConfirmationDialogProps) {
  const onSubmit = () => {
    props.onSubmit?.({ index: props.dataIndex });
  };

  return (
    <LoonasDialog open={props.open} title="Hapus Item?" width="md" onClose={props.onClose}>
      <p className="text-base text-neutral-500">Apakah Anda yakin ingin menghapus item ini?</p>
      <div className="my-4 flex gap-y-1">
        <p className="text-sm text-neutral-500">Nama Item: {props.data.name}</p>
      </div>
      <DialogFooter>
        <SecondaryButton outlined type="button" label="Batal" onClick={props.onClose} />
        <DangerButton type="button" label="Hapus" onClick={onSubmit} />
      </DialogFooter>
    </LoonasDialog>
  );
}
