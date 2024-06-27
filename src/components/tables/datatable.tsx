import React from "react";
import { useTheme } from '@mui/material/styles';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableFooter, Typography, IconButton, Tooltip } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Grid } from "@mui/material";
import { type Decimal } from "@prisma/client/runtime/library";
import { formatDateFromIso } from "~/utils/dateUtils";
import Image from "next/image";
import path from "path";

export type ColumnType = "string" | "date" | "number" | "decimal" | "bool" | "action" | "image" | "currency";

export type Rows = Record<string, string | number | Decimal | boolean | Date | null | undefined>;

export interface Column {
  key: string;
  type: ColumnType;
  align?: "left" | "center" | "right";
  header?: string;
  width?: string;
  visible?: boolean;
  hiddenOnlyOnXs?: boolean
  sortable?: boolean;
  imageProps?: {
    imageWidth?: number;
    imageHeight?: number;
    imageTooltipType?: 'static' | 'dynamic';
    imageTooltip?: string;
  };
  formatDate?: string;
  currency?: string;
}

export interface ActionOptions {
  keyFields: string[];
  keyEvalVisibility?: string;
  component: (...params: string[]) => React.ReactNode | null;
}

interface DataTableProps {
  title?: string;
  messageWhenEmptyList?: string;
  errorMessage?: string;
  data?: Rows[];
  columns: Column[];
  pagination?: boolean;
  autoHidePagination?: boolean;
  rowsXPage?: number;
  actionOptions?: ActionOptions[];
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function DataTable({
  title = "",
  pagination = false,
  messageWhenEmptyList = "Non è presente nessun record",
  errorMessage = "",
  data = [],
  columns = [],
  rowsXPage = 10,
  actionOptions = [] }: DataTableProps) {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsXPage);
  const headers = columns.map((column) => column.key);
  const [selectedRecord, setSelectedRecord] = React.useState<Rows | null>(null);
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleColumnSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
    setSortColumn(null);
    setSortDirection("asc");
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPaginatedData = () => {
    const sortedData = [...data];

    if (sortColumn) {
      sortedData.sort((a, b) => {
        const columnA = a[sortColumn];
        const columnB = b[sortColumn];

        if (columnA === null || columnB === null) {
          return 0;
        }

        if (columnA === undefined || columnB === undefined) {
          return 0;
        }

        if (columnA === columnB) {
          return 0;
        }

        if (sortDirection === "asc") {
          return columnA < columnB ? -1 : 1;
        } else {
          return columnA > columnB ? -1 : 1;
        }
      });
    }

    return rowsPerPage > 0
      ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : sortedData;
  };

  return (
    <Grid item xs={12} sx={{ overflow: "auto", p: 0 }}>
      <Paper elevation={3}
          sx={{ display: "grid", gridAutoColumns: "1fr", overflow: "auto", gap: 0, m: '4px' }}>
        
        <Table size="small" sx={{ p: 0 }}>
          <TableHead>
            <TableRow key="headTitle">
              <TableCell key="cellTitle" colSpan={headers.length}>
                <Typography variant="h4" color="primary.main">
                  {title}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow key="headers">
              {getPaginatedData().length > 0 ? (
                <>
                  {headers.map((header, i) => {
                    const column = columns.find((col) => col.key.toLowerCase() === header.toLowerCase());
                    const align = column?.align ? column?.align : "right";
                    const width = column?.width ? column?.width : 0;
                    const label = column?.header ? column?.header : header.replace(/([A-Z])/g, " $1").trim();
                    const isSortable = column?.sortable ? column?.sortable : false;
                    const isSortingColumn = sortColumn === column?.key;
                    const isSortAscending = sortDirection === "asc";
                    const columnKey = column?.key ? column?.key : '';
                    return (
                      <TableCell
                        align={align}
                        sx={column?.hiddenOnlyOnXs === true ? { display: { xs: 'none', sm: 'table-cell' } } : column?.visible === false ? { display : 'none' } : { display : '' }}
                        //style={{ width: width, display: display }}
                        style={{ width: width }}
                        key={`${header}${i}`}
                        onClick={() => {
                          if (isSortable) {
                            handleColumnSort(columnKey);
                          }
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          color="primary.light"
                        >
                          {label}
                          {isSortable && (
                            <span>
                              {isSortingColumn && isSortAscending ? (
                                <KeyboardArrowUpIcon fontSize="small" />
                              ) : (
                                <KeyboardArrowDownIcon fontSize="small" />
                              )}
                            </span>
                          )}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </>
              ) : (
                //empty list
                <TableCell align="center" key="emptyListCell">
                  {messageWhenEmptyList}
                </TableCell>
              )}
            </TableRow>
            <TableRow key="errorLoading">
              {errorMessage !== "" && (
                <TableCell align="center" key="errorMessageCell" colSpan={headers.length}>
                  <Typography variant="h5" color="error.main">
                  {errorMessage}
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {getPaginatedData().map((record, iRow) => {
              return (
                <TableRow key={`dataRow_${iRow}`}
                  hover={true}
                  onClick={() => setSelectedRecord(prevSelected => (prevSelected === record ? null : record))}
                  selected={selectedRecord === record}
                  className={selectedRecord === record ? 'selected-row' : ''}>
                  {columns
                    .filter((column) => columns.map((column) => column.key.toLowerCase()).includes(column.key.toLowerCase()))
                    .map(({ key, type }, iCell) => {
                      const column = columns.find((column) => column.key.toLowerCase() === key.toLowerCase()); 
                      const cellKey = `dataCell_${iCell}_${iRow}_${Math.random()}`;
                      const cellProps = {
                        align: column?.align ? column.align : (type === 'bool' ? 'center' : 'right'),
                        sx: column?.hiddenOnlyOnXs === true ? { display: { xs: 'none', sm: 'table-cell' } } : column?.visible === false ? { display : 'none' } : { display : '' },
                        style: { display: column?.visible === false ? 'none' : '' }
                      };

                      switch (type) {
                        case "string":
                        case "number":
                        case "decimal":
                          return (
                            <TableCell key={cellKey} {...cellProps}>
                              {record[key]?.toString()}
                            </TableCell>
                          );
                        case "currency":
                          return (
                            <TableCell key={cellKey} {...cellProps}>
                              {`${record[key]?.toString()} ${column?.currency}`}
                            </TableCell>
                          );
                        case "bool":
                          return (
                            <TableCell key={cellKey} {...cellProps}>
                              {record[key] ? "Si" : "No"}
                            </TableCell>
                          );
                        case "date":
                          const formattedDate = record[key] ? formatDateFromIso(record[key] as string, column?.formatDate ? column.formatDate : "dd/MM/yyyy HH:mm") : "";
                          return (
                            <TableCell key={cellKey} {...cellProps}>
                              {formattedDate}
                            </TableCell>
                          );
                        case "image":
                          return (
                            <TableCell key={cellKey} {...cellProps} > 
                              <Tooltip title={(column?.imageProps?.imageTooltipType === 'static' ? column?.imageProps?.imageTooltip ?? '' : record[column?.imageProps?.imageTooltip ?? key]?.toString()) ?? ''} placement="top-start">
                                {/* <Image src={record[key]?.toString() ?? ''}
                                  width={column?.ImageWidth ?? 20}
                                  height={column?.imageHeight ?? 20}
                                  alt={(column?.imageTooltipType === 'static' ? column?.imageTooltip ?? '' : record[column?.imageTooltip ?? key]?.toString()) ?? ''} /> */}
                                <img src={record[key]?.toString() ?? ''}
                                  width={column?.imageProps?.imageWidth ?? 20}
                                  height={column?.imageProps?.imageHeight ?? 20}
                                  alt={(column?.imageProps?.imageTooltipType === 'static' ? column?.imageProps?.imageTooltip ?? '' : record[column?.imageProps?.imageTooltip ?? key]?.toString()) ?? ''} />
                              </Tooltip>
                            </TableCell>
                          );
                        default:
                          return null;
                      }
                    })}
                  {/* Renderizzazione dei pulsanti di azione */}
                  {actionOptions?.map((option, iAction) => {
                    const display = option.keyEvalVisibility ? record[option.keyEvalVisibility] ? '' : 'none' : '';
                    const { keyFields, component } = option;

                    return (
                      <TableCell style={{ display: display, cursor: 'pointer' }} align={'right'} key={`actionCell_${iAction}_${iRow}`}>
                        <React.Fragment>{component && component(...keyFields.map(key => record[key] as string))}</React.Fragment>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
            }
          </TableBody>
          <TableFooter sx={{
                    ".MuiTablePagination-displayedRows": { color: "green", p: '0px', minHeight:'10px' },
                    ".MuiTablePagination-selectLabel": { color: "green", p: '0px', minHeight:'10px' },
                    ".MuiTablePagination-toolbar": { p: '0px', minHeight:'10px' },
                    ".MuiTablePagination-root": { p: '0px', minHeight:'10px' },
                    ".MuiTablePagination-root:last-child": { p: '0px', minHeight:'10px' },
                    ".MuiTablePagination-footer": { p: '0px', minHeight:'10px' },
                    ".MuiTablePagination-menuItem": { color: "green", p: '0px', minHeight:'10px' },
                    ".MuiTablePagination-list": { color: "green", minHeight:'10px' },
                    p: '0px',
                    Height:'10px'
                  }}>
            <TableRow key="tableFooter">
              {(pagination || data.length > rowsPerPage) && (
                <TablePagination
                  color="primary"
                  rowsPerPageOptions={rowsPerPage !== 5 && rowsPerPage !== 10 && rowsPerPage !== 25 ? [] : [5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={headers.length}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              )}
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </Grid>
  );
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(
      event,
      Math.max(0, Math.ceil(count / rowsPerPage) - 1)
    );
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default DataTable;
