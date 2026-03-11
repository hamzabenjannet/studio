"use client";

// import React, { useState, useEffect } from "react";
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// import { MainSidebar } from "@/components/main-sidebar";
// import { Header } from "@/components/header";
// import withAuth from "@/hoc/withAuth";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Plus } from "lucide-react";
// import { useTranslations } from "next-intl";

// import {
//   createWorkOrder as createEntityWorkOrderService,
//   filterWorkOrders as datasetFetchMethod,
//   updateWorkOrder as updateEntityWorkOrderService,
// } from "@/services/work-order/work-order.service";

// import { StatusEnum as SttsEnum } from "@/enums/status.enum";
// import { TableSection } from "@/components/ui/table";

// import { buildFetchElements, handleSaveEntity } from "@/services/common";

// import {
//   datasetFetchResponseItemsAttr,
//   IEntity,
//   itemInitState,
// } from "./entity";
// import { buildEntityForms } from "./forms";

// "use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { Header } from "@/components/header";
import withAuth from "@/hoc/withAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  handleSaveEntity,
  IPagination,
  pageSizeOptions,
} from "@/services/common";

import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

import { buildEntityForms } from "./forms";
import {
  datasetFetchResponseItemsAttr,
  IEntity,
  itemInitState,
  createEntityService,
  fetchElements,
  updateEntityService,
} from "./entity";

import EditItemDialog from "../dialogs/edit-item";
import DeleteItemDialog from "../dialogs/delete-item";
import GridActionsCellWrapper from "../template/GridActionsCellWrapper";
import { formatEntityRecursive } from "./tools";

function ElementsPage() {
  const translation = useTranslations();

  const [elements, setElements] = useState<{
    [datasetFetchResponseItemsAttr]: IEntity[];
    pagination: IPagination;
  }>({
    [datasetFetchResponseItemsAttr]: [] as IEntity[],
    pagination: {} as IPagination,
  });

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const [formData, setFormData] = useState<IEntity | undefined>(itemInitState);
  const [itemToDelete, setItemToDelete] = useState<IEntity | null>(null);

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const { entityAttrName } = e.target.dataset;
    setFormData((prev) => ({
      ...prev,
      ...(entityAttrName ? { [entityAttrName]: value } : {}),
    }));
  };

  const { entityForms } = buildEntityForms({
    translation,
    handleFormInputChange: handleFormInputChange,
  });

  const dataGridColumns: GridColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      renderCell: GridActionsCellWrapper({ setFormData }),
    },
    ...Object.keys(itemInitState)
      .filter((key) => !["password"].includes(key))
      .map((key) => ({
        field: key,
        headerName: key,
        width: 100,
      })),
  ];

  const dataGridRows: GridRowsProp = elements[
    datasetFetchResponseItemsAttr
  ].map((element) => ({
    ...element,
    id: element._id,
  }));

  const dialogsProps = {
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
  };

  useEffect(() => {
    if (formData?._id !== itemInitState._id) {
      return;
    }
    fetchElements({
      itemsPerPage: paginationModel.pageSize,
      currentPage: paginationModel.page + 1,
    }).then((fetchElementsResults) => {
      setElements(
        fetchElementsResults as {
          pagination: IPagination;
          [datasetFetchResponseItemsAttr]: IEntity[];
        },
      );
    });
  }, [formData?._id, paginationModel.page, paginationModel.pageSize]);
  // end ElementsPage states and handlers setup

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <EditItemDialog {...dialogsProps} />
        <DeleteItemDialog {...dialogsProps} />

        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <Card>
            <CardHeader>
              <CardTitle>{translation("workOrders.page.pageTitle")}</CardTitle>
              <CardDescription>
                {translation("workOrders.page.pageSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="mb-4 bg-green-500 text-white py-1"
                onClick={() => {
                  setFormData({ ...itemInitState, _id: -1 });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {translation("common.addItemButton")}
              </Button>

              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={dataGridRows}
                  columns={dataGridColumns}
                  showToolbar
                  rowCount={elements.pagination?.totalItems || 0}
                  pageSizeOptions={pageSizeOptions}
                  paginationMode="server"
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  //  https://mui.com/x/react-data-grid/pagination/
                />
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withAuth(ElementsPage);

// function ElementsPage_0() {
//   // begin ElementsPage states and handlers setup
//   const translation = useTranslations();
//   const [elements, setElements] = useState<IEntity[]>([] as IEntity[]);
//   const [formData, setFormData] = useState<IEntity | undefined>(itemInitState);
//   const [itemToDelete, setItemToDelete] = useState<IEntity | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     const { entityAttrName } = e.target.dataset;
//     setFormData((prev) => ({
//       ...prev,
//       ...(entityAttrName ? { [entityAttrName]: value } : {}),
//     }));
//   };
//   const { entityForms } = buildEntityForms({
//     translation,
//     handleFormInputChange: handleFormInputChange,
//   });
//   const fetchElements = buildFetchElements<IEntity>({
//     setElements,
//     setTotalPages,
//     datasetFetchMethod,
//     datasetFetchResponseItemsAttr,
//   });
//   useEffect(() => {
//     fetchElements({
//       itemsPerPage,
//       currentPage,
//     });
//   }, [formData?._id, currentPage, itemsPerPage]);
//   // end ElementsPage states and handlers setup

//   return (
//     <SidebarProvider>
//       <MainSidebar />
//       <SidebarInset>
//         <Header />
//         <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
//           <div className="flex items-center justify-between space-y-2">
//             <div>
//               <h1 className="text-3xl font-headline font-bold tracking-tight">
//                 {translation("workOrders.page.pageTitle")}
//               </h1>
//               <p className="text-muted-foreground">
//                 {translation("workOrders.page.pageSubtitle")}
//               </p>
//             </div>
//             <Button
//               onClick={() => {
//                 setFormData({ ...itemInitState, _id: -1 });
//               }}
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               {translation("common.addItemButton")}
//             </Button>
//           </div>

//           <Dialog
//             open={
//               formData?._id === -1 ||
//               parseInt(formData?._id?.toString() || "0") >= 0
//             }
//             onOpenChange={() => {
//               setFormData(itemInitState);
//             }}
//           >
//             <DialogContent className="sm:max-w-xl">
//               <DialogHeader>
//                 <DialogTitle>
//                   {formData?._id !== -1
//                     ? translation("common.editItemDialogTitle")
//                     : translation("common.addItemDialogTitle")}
//                 </DialogTitle>
//                 <DialogDescription>
//                   {formData?._id !== -1
//                     ? translation("common.editItemDialogSubtitle")
//                     : translation("common.addItemDialogSubtitle")}
//                 </DialogDescription>
//               </DialogHeader>
//               <form
//                 onSubmit={(event) => {
//                   handleSaveEntity({
//                     formData,
//                     createEntityService: createEntityWorkOrderService,
//                     updateEntityService: updateEntityWorkOrderService,
//                   })(event)?.then((result) => {
//                     if (result) {
//                       setFormData(itemInitState);
//                     }
//                   });
//                 }}
//               >
//                 <div
//                   // className="grid
//                   // grid-cols-2
//                   //  gap-4 py-4"
//                   // className="grid
//                   // grid-cols-6
//                   //  gap-4 py-4"
//                   className="grid grid-cols-4 gap-4 py-4"
//                 >
//                   {Object.entries(entityForms.editItemAttributes).map(
//                     ([inputKeyName, inputComponents]) => {
//                       const value = formData?.[
//                         inputComponents.input
//                           .dataEntityAttrName as keyof IEntity
//                       ] as unknown as any;

//                       return (
//                         <div
//                           className="col-span-2 space-y-2"
//                           key={inputKeyName}
//                         >
//                           {inputComponents.label.Render({})}

//                           {inputComponents.input.Render({
//                             // value: formData?.[
//                             //   inputComponents.input
//                             //     .dataEntityAttrName as keyof IEntity
//                             // ] as unknown as string | number | undefined | IEntityUser[] | IEntityVehicule[] | IEntityStock[] | IEntity[],
//                             value,
//                             onChange: handleFormInputChange,
//                           })}
//                         </div>
//                       );
//                     },
//                   )}
//                 </div>
//                 <DialogFooter>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setFormData(itemInitState)}
//                   >
//                     {translation("common.cancelText")}
//                   </Button>
//                   <Button type="submit">
//                     {translation("common.saveText")}
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </DialogContent>
//           </Dialog>

//           <AlertDialog
//             open={itemToDelete?._id ? true : false}
//             onOpenChange={(open) => !open && setItemToDelete(null)}
//           >
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>
//                   {translation("common.alertDeleteItemTitle")}
//                 </AlertDialogTitle>
//                 <AlertDialogDescription>
//                   {translation("common.alertDeleteItemDescription")}
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel
//                   onClick={() => {
//                     setItemToDelete(null);
//                   }}
//                 >
//                   {translation("common.cancelText")}
//                 </AlertDialogCancel>
//                 <AlertDialogAction
//                   onClick={() => {
//                     const formDataDto = {
//                       ...itemToDelete,
//                       status: SttsEnum.TO_BE_DELETED,
//                     };

//                     handleSaveEntity({
//                       formData: formDataDto,
//                       createEntityService: createEntityWorkOrderService,
//                       updateEntityService: updateEntityWorkOrderService,
//                     })()?.finally(() => {
//                       fetchElements({
//                         currentPage,
//                       });

//                       // close the dialog
//                       setFormData(itemInitState);
//                     });
//                   }}
//                 >
//                   {translation("common.alertDeleteItemConfirm")}
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>

//           <Card>
//             <CardHeader>
//               <CardTitle>
//                 {translation("workOrders.page.itemsTabeTitle")}
//               </CardTitle>
//               <CardDescription>
//                 {translation("workOrders.page.itemsTabeSubtitle")}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="w-full">
//                   <input
//                     id="formInputText7Search1"
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       setCurrentPage(1);
//                     }}
//                     className="w-full p-2 border rounded-md"
//                   />
//                 </div>
//                 <div className="w-full p-2">
//                   <Select
//                     value={itemsPerPage.toString()}
//                     onValueChange={(value) => setItemsPerPage(Number(value))}
//                   >
//                     <SelectTrigger id="itemsPerPageSelectInputId">
//                       <SelectValue placeholder="Items per page" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="5">5</SelectItem>
//                       <SelectItem value="10">10</SelectItem>
//                       <SelectItem value="20">20</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <TableSection
//                 // elements={elements}
//                 elements={(elements || []).map((elementsItem: IEntity) => {
//                   const { vehicle, labors, materials } = elementsItem;
//                   return {
//                     ...elementsItem,
//                     vehicleString: vehicle
//                       ? formatEntityRecursive(vehicle)
//                       : "-",
//                     laborsString:
//                       labors && labors.length > 0
//                         ? formatEntityRecursive(labors)
//                         : "-",
//                     materialsString:
//                       materials && materials.length > 0
//                         ? formatEntityRecursive(materials)
//                         : "-",
//                   };
//                 })}
//                 handleEditClick={(item: IEntity) => {
//                   setFormData(item);
//                 }}
//                 handleDeleteClick={setItemToDelete}
//                 newItemInitialState={itemInitState}
//                 currentPage={currentPage}
//                 setCurrentPage={setCurrentPage}
//                 itemsPerPage={itemsPerPage}
//                 totalPages={totalPages}
//                 searchTerm={searchTerm}
//                 columns={Object.keys(itemInitState).filter(
//                   (key) => !["password"].includes(key),
//                 )}
//               />

//               {/* Debug: item details */}
//               {/* {elements.map((entityItem) => (
//                 <div key={entityItem._id}>
//                   {Object.keys(entityItem).map((key) => (
//                     <div key={key}>
//                       {key}: {entityItem[key as keyof IEntity]}
//                     </div>
//                   ))}
//                 </div>
//               ))} */}
//             </CardContent>
//           </Card>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

// export default withAuth(ElementsPage);
