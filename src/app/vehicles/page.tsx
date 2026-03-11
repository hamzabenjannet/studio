"use client";

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
              <CardTitle>{translation("vehicles.page.pageTitle")}</CardTitle>
              <CardDescription>
                {translation("vehicles.page.pageSubtitle")}
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
