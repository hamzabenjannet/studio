"use client";

import { GridActionsCell, GridActionsCellItem } from "@mui/x-data-grid";
import { EditIcon } from "lucide-react";

export default function GridActionsCellWrapper(props: any) {
  const { setFormData } = props;
  return (params: any) => {
    return (
      <GridActionsCell {...params}>
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => {
            setFormData(params.row);
          }}
        />
      </GridActionsCell>
    );
  };
}
