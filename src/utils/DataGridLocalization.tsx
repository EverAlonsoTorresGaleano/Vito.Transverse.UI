import { useTranslation } from 'react-i18next';

export const useDataGridLocalization = () => {
  const { t } = useTranslation();

  return {
    // Pagination
    MuiTablePagination: {
      labelRowsPerPage: t('GridView_LabelRowsPerPage'),
      labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) => {
        if (count === -1) {
          return `${from}–${to} ${t('GridView_OfMoreThan')}`;
        }
        return `${from}–${to} ${t('GridView_Of')} ${count}`;
      },
    },
    // Toolbar
    toolbarDensity: t('GridView_ToolbarDensity'),
    toolbarDensityLabel: t('GridView_ToolbarDensityLabel'),
    toolbarDensityCompact: t('GridView_ToolbarDensityCompact'),
    toolbarDensityStandard: t('GridView_ToolbarDensityStandard'),
    toolbarDensityComfortable: t('GridView_ToolbarDensityComfortable'),
    toolbarColumns: t('GridView_ToolbarColumns'),
    toolbarColumnsLabel: t('GridView_ToolbarColumnsLabel'),
    toolbarFilters: t('GridView_ToolbarFilters'),
    toolbarFiltersLabel: t('GridView_ToolbarFiltersLabel'),
    toolbarFiltersTooltipHide: t('GridView_ToolbarFiltersTooltipHide'),
    toolbarFiltersTooltipShow: t('GridView_ToolbarFiltersTooltipShow'),
    toolbarFiltersTooltipActive: (count: number) =>
      count !== 1 ? `${count} ${t('GridView_ToolbarFiltersTooltipActive')}` : `${count} ${t('GridView_ToolbarFiltersTooltipActive')}`,
    toolbarExport: t('GridView_ToolbarExport'),
    toolbarExportLabel: t('GridView_ToolbarExportLabel'),
    toolbarExportCSV: t('GridView_ToolbarExportCSV'),
    toolbarExportPrint: t('GridView_ToolbarExportPrint'),
    toolbarExportExcel: t('GridView_ToolbarExportExcel'),
    // Columns panel
    columnsPanelTextFieldLabel: t('GridView_ColumnsPanelTextFieldLabel'),
    columnsPanelTextFieldPlaceholder: t('GridView_ColumnsPanelTextFieldPlaceholder'),
    columnsPanelDragIconLabel: t('GridView_ColumnsPanelDragIconLabel'),
    columnsPanelShowAllButton: t('GridView_ColumnsPanelShowAllButton'),
    columnsPanelHideAllButton: t('GridView_ColumnsPanelHideAllButton'),
    // Filter panel
    filterPanelAddFilter: t('GridView_FilterPanelAddFilter'),
    filterPanelRemoveAll: t('GridView_FilterPanelRemoveAll'),
    filterPanelDeleteIconLabel: t('GridView_FilterPanelDeleteIconLabel'),
    filterPanelLogicOperator: t('GridView_FilterPanelLogicOperator'),
    filterPanelOperator: t('GridView_FilterPanelOperator'),
    filterPanelOperatorAnd: t('GridView_FilterPanelOperatorAnd'),
    filterPanelOperatorOr: t('GridView_FilterPanelOperatorOr'),
    filterPanelColumns: t('GridView_FilterPanelColumns'),
    filterPanelInputLabel: t('GridView_FilterPanelInputLabel'),
    filterPanelInputPlaceholder: t('GridView_FilterPanelInputPlaceholder'),
    // Filter operators
    filterOperatorContains: t('GridView_FilterOperatorContains'),
    filterOperatorEquals: t('GridView_FilterOperatorEquals'),
    filterOperatorStartsWith: t('GridView_FilterOperatorStartsWith'),
    filterOperatorEndsWith: t('GridView_FilterOperatorEndsWith'),
    filterOperatorIs: t('GridView_FilterOperatorIs'),
    filterOperatorNot: t('GridView_FilterOperatorNot'),
    filterOperatorAfter: t('GridView_FilterOperatorAfter'),
    filterOperatorOnOrAfter: t('GridView_FilterOperatorOnOrAfter'),
    filterOperatorBefore: t('GridView_FilterOperatorBefore'),
    filterOperatorOnOrBefore: t('GridView_FilterOperatorOnOrBefore'),
    filterOperatorIsEmpty: t('GridView_FilterOperatorIsEmpty'),
    filterOperatorIsNotEmpty: t('GridView_FilterOperatorIsNotEmpty'),
    filterOperatorIsAnyOf: t('GridView_FilterOperatorIsAnyOf'),
    // Column menu text
    columnMenuLabel: t('GridView_ColumnMenuLabel'),
    columnMenuShowColumns: t('GridView_ColumnMenuShowColumns'),
    columnMenuManageColumns: t('GridView_ColumnMenuManageColumns'),
    columnMenuFilter: t('GridView_ColumnMenuFilter'),
    columnMenuHideColumn: t('GridView_ColumnMenuHideColumn'),
    columnMenuUnsort: t('GridView_ColumnMenuUnsort'),
    columnMenuSortAsc: t('GridView_ColumnMenuSortAsc'),
    columnMenuSortDesc: t('GridView_ColumnMenuSortDesc'),
    // Column header text
    columnHeaderFiltersTooltipActive: (count: number) =>
      count !== 1 ? `${count} ${t('GridView_ColumnHeaderFiltersTooltipActive')}` : `${count} ${t('GridView_ColumnHeaderFiltersTooltipActive')}`,
    columnHeaderFiltersLabel: t('GridView_ColumnHeaderFiltersLabel'),
    columnHeaderSortIconLabel: t('GridView_ColumnHeaderSortIconLabel'),
    // Rows selected
    footerRowSelected: (count: number) =>
      count !== 1
        ? `${count} ${t('GridView_FooterRowSelected')}`
        : `${count} ${t('GridView_FooterRowSelected')}`,
    // Total row amount
    footerTotalRows: t('GridView_FooterTotalRows'),
    // Total visible row amount
    footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
      `${visibleCount} ${t('GridView_FooterTotalVisibleRowsOf')} ${totalCount}`,
    // Checkbox selection
    checkboxSelectionHeaderName: t('GridView_CheckboxSelectionHeaderName'),
    // Actions cell
    actionsCellMore: t('GridView_ActionsCellMore'),
    paginationRowsPerPage: t('GridView_PaginationRowsPerPage'),
    paginationDisplayedRows: (params: { from: number; to: number; count: number }) => t('GridView_PaginationDisplayedRows', { from: params.from, to: params.to, count: params.count }),
  };
};

