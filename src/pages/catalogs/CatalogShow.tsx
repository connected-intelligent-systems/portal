import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  EditButton,
  TopToolbar,
  ReferenceManyField,
  Pagination,
  useRecordContext,
  SelectInput,
  FilterForm,
  TextInput,
  useListContext,
  useTranslate,
  useLocale,
} from "react-admin";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import { useMemo } from "react";
import { DatasetCard } from "./DatasetCard";
import { Dataset } from "../../types/catalog";
import { getCategoryChoices } from "../../utils/categories";

const useDynamicItemsPerPage = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  return useMemo(() => {
    if (isLargeScreen) {
      return 12; // 3 columns × 4 rows = 12 items
    }
    if (isMediumScreen) {
      return 10; // 2 columns × 5 rows = 10 items
    }
    return 8; // 1 column × 8 rows = 8 items
  }, [isLargeScreen, isMediumScreen]);
};

const DynamicPagination = () => {
  return <Pagination rowsPerPageOptions={[]} />;
};

const CatalogShowActions = () => (
  <TopToolbar>
    <EditButton />
  </TopToolbar>
);

const DatasetsWithFilters = () => {
  const catalogRecord = useRecordContext();
  const catalogUrl = catalogRecord?.url;
  const { data } = useListContext();
  const translate = useTranslate();
  const locale = useLocale();

  const categoryChoices = getCategoryChoices(locale);

  const filters = [
    <TextInput
      key="title"
      source="title"
      label={translate("resources.catalog.filters.search")}
      alwaysOn
      resettable
    />,
    <SelectInput
      key="category"
      source="category"
      label={translate("resources.catalog.filters.category")}
      choices={categoryChoices}
      alwaysOn
    />,
  ];

  return (
    <Box>
      <FilterForm filters={filters} />
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {data?.map((dataset: Dataset, index: number) => (
          <DatasetCard
            key={dataset.id || index}
            dataset={dataset}
            index={index}
            counterPartyAddress={catalogUrl}
          />
        ))}
      </Box>
    </Box>
  );
};

const DatasetsSection = () => {
  const translate = useTranslate();
  const dynamicPerPage = useDynamicItemsPerPage();

  return (
    <ReferenceManyField
      reference="datasets"
      target="url"
      source="url"
      label={translate("resources.catalog.fields.datasets")}
      perPage={dynamicPerPage}
      pagination={<DynamicPagination />}
    >
      <DatasetsWithFilters />
    </ReferenceManyField>
  );
};

export const CatalogShow = () => {
  const translate = useTranslate();
  return (
    <Show actions={<CatalogShowActions />}>
      <SimpleShowLayout>
        <TextField
          source="name"
          label={translate("resources.catalog.fields.name")}
        />
        <TextField
          source="url"
          label={translate("resources.catalog.fields.url")}
        />
        <TextField
          source="description"
          label={translate("resources.catalog.fields.description")}
          emptyText="-"
        />
        <DateField
          source="dateAdded"
          label={translate("resources.catalog.fields.dateAdded")}
          showTime
        />
        <DateField
          source="lastConnected"
          label={translate("resources.catalog.fields.lastConnected")}
          showTime
        />
        <DatasetsSection />
      </SimpleShowLayout>
    </Show>
  );
};
