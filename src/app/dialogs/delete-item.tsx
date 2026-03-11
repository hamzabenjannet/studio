"use client";

import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusEnum } from "@/enums/status.enum";

function DeleteItemDialog<IEntity>(props?: any) {
  const translation = useTranslations();

  const {
    formData,
    setFormData,
    itemInitState,
    handleSaveEntity,
    createEntityService,
    updateEntityService,
    entityForms,
    handleFormInputChange,
    itemToDelete,
    setItemToDelete,
  } = props;

  return (
    <AlertDialog
      open={itemToDelete?._id ? true : false}
      onOpenChange={(open) => !open && setItemToDelete(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {translation("common.alertDeleteItemTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {translation("common.alertDeleteItemDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setItemToDelete(null);
            }}
          >
            {translation("common.cancelText")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              const formDataDto = {
                ...itemToDelete,
                id: undefined,
                status: StatusEnum.TO_BE_DELETED,
              };

              handleSaveEntity({
                formData: formDataDto,
                createEntityService,
                updateEntityService,
              })()?.finally(() => {
                // close the dialog
                setFormData(itemInitState);
              });
            }}
          >
            {translation("common.alertDeleteItemConfirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default DeleteItemDialog;
