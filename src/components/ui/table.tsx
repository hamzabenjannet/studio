import * as React from "react";

import { cn } from "@/lib/utils";
import { TableComponent } from "nextjs-reusable-table";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

function TableSection<IEntity extends Record<string, any>>({
  elements,
  handleEditClick,
  handleDeleteClick,
  newItemInitialState = {} as IEntity,
  currentPage = 1,
  itemsPerPage = 10,
  totalPages = Math.ceil(elements.length / itemsPerPage),
  searchTerm = "",
  setCurrentPage = (_page: number) => {},
  columns = [] as string[],
}: {
  elements: IEntity[];
  handleEditClick: (item: IEntity) => void;
  handleDeleteClick: (item: IEntity) => void;
  newItemInitialState?: IEntity;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  searchTerm?: string;
  itemsPerPage?: number;
  totalPages?: number;
  columns?: string[];
}) {
  return (
    <div className="space-y-4 [&_td]:whitespace-pre-wrap [&_td]:min-w-[200px] [&_td]:text-xs">
      <TableComponent<IEntity>
        columns={
          columns.length > 0 ? columns : [...Object.keys(newItemInitialState)]
        }
        data={elements}
        props={columns.length ? columns : [...Object.keys(newItemInitialState)]}
        sortableProps={
          // all entity props dynamically
          // TODO: fix sorting
          columns.length ? columns : [...Object.keys(newItemInitialState)]
        }
        searchValue={searchTerm}
        enablePagination
        page={currentPage}
        setPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        actions
        actionTexts={["Edit", "Delete"]}
        totalPages={totalPages}
        actionFunctions={[
          (item) => handleEditClick(item),
          (item) => handleDeleteClick(item),
        ]}
        customClassNames={{
          actionDropdown: {
            // container: "bg-gray-100 dark:bg-gray-800",
            menu: "bg-gray-100 dark:bg-gray-800",
            // item: "hover:bg-gray-200 dark:hover:bg-gray-700",
            // overlay: "bg-gray-100/80 dark:bg-gray-800/80",
          },
        }}
      />
    </div>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableSection,
};
