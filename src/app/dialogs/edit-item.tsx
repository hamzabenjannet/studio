"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { MultipleSelectCheckmarks } from "../workOrders/forms";

type InputComponentProps = {
  label: {
    Render: (props?: any) => React.JSX.Element;
  };
  input: {
    type: string;
    dataEntityAttrName: string;
    Render: (props?: any) => React.JSX.Element;
  };
};

function EditItemDialog<IEntity>(props?: any) {
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

  useEffect(() => {
    console.log("EditItemDialog formData", formData);

    // return ()=>{}
  }, [formData?._id]);

  return (
    <Dialog
      open={
        formData?._id === -1 || parseInt(formData?._id?.toString() || "0") >= 0
      }
      onOpenChange={() => {
        setFormData(itemInitState);
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {formData?._id !== -1
              ? translation("common.editItemDialogTitle")
              : translation("common.addItemDialogTitle")}
          </DialogTitle>
          <DialogDescription>
            {formData?._id !== -1
              ? translation("common.editItemDialogSubtitle")
              : translation("common.addItemDialogSubtitle")}
          </DialogDescription>
        </DialogHeader>
        {/* <form
          onSubmit={(event) => {
            handleSaveEntity({
              formData: { ...formData, id: undefined },
              createEntityService,
              updateEntityService,
            })(event)?.finally(() => {
              setFormData(itemInitState);
            });
          }}
        > */}
        <div
          // className="grid grid-cols-2 gap-4 py-4"
          // className="grid grid-cols-6 gap-4 py-4"
          className="grid grid-cols-4 gap-4 py-4"
        >
          {Object.entries(entityForms.editItemAttributes).map(
            (formComponent) => {
              const [inputKeyName, inputComponents] = formComponent as [
                string,
                InputComponentProps,
              ];

              return (
                <div className="col-span-2 space-y-2" key={inputKeyName}>
                  {inputComponents?.label?.Render({})}

                  {inputComponents?.input?.Render({
                    value: formData?.[
                      inputComponents.input.dataEntityAttrName as keyof IEntity
                    ] as string | number | undefined,

                    onChange: handleFormInputChange,
                  })}
                </div>
              );
            },
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData(itemInitState)}
          >
            {translation("common.cancelText")}
          </Button>

          <Button
            disabled={formData?._id === -1}
            type="button"
            className="bg-red-500 text-white py-1 rounded-md px-1 mb-1"
            onClick={() => {
              // setFormData(itemInitState);
              if (!formData) {
                return;
              }
              setItemToDelete(formData);
            }}
          >
            Archive
          </Button>
          <Button
            disabled={formData?._id === -1}
            type="button"
            className="bg-blue-500 text-white py-1 rounded-md px-1 mb-1 small btn-"
            onClick={() => {
              setFormData({
                ...formData,
                _id: -1,
                email: "",
                password: "",
              });
            }}
          >
            Duplicate
          </Button>
          <Button
            // type="submit"
            type="button"
            className="bg-green-500 text-white py-1 rounded-md px-1 mb-1"
            onClick={() => {
              const formDataPayload = { ...formData, id: undefined };
              // console.log("formDataPayload", formDataPayload);

              handleSaveEntity({
                formData: formDataPayload,
                createEntityService,
                updateEntityService,
              })()?.finally(() => {
                setFormData(itemInitState);
              });
            }}
          >
            {translation("common.saveText")}
          </Button>
        </DialogFooter>
        {/* </form> */}
      </DialogContent>
    </Dialog>
  );
}
export default EditItemDialog;
