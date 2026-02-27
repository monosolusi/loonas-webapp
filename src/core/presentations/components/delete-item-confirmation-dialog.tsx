import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { FilledButton } from "@/core/presentations/components/filled-button";

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
      <p className="text-base text-gray-500">Apakah Anda yakin ingin menghapus item ini?</p>
      <div className="my-4 flex gap-y-1">
        <p className="text-sm text-gray-500">Nama Item: {props.data.name}</p>
      </div>
      <div className="-mx-4 flex flex-row justify-end space-x-4 border-t border-gray-200 px-4 pt-4 sm:-mx-6 sm:px-6">
        <SecondaryButton outlined type="button" label="Batal" onClick={props.onClose} />
        <FilledButton type="button" onClick={onSubmit} color="danger">
          Hapus
        </FilledButton>
      </div>
    </LoonasDialog>
  );
}
