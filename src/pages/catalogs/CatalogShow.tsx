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
import { Box, Grid } from "@mui/material";
import { DatasetCard } from "./DatasetCard";
import { Dataset } from "../../types/catalog";
import { getCategoryChoices } from "../../utils/categories";

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
      <Grid container spacing={2} sx={{ mt: 1 }} >
        {data?.map((dataset: Dataset, index: number) => (
          <DatasetCard
            key={dataset.id || index}
            dataset={dataset}
            index={index}
            counterPartyAddress={catalogUrl}
          />
        ))}
      </Grid>
    </Box>
  );
};

const DatasetsSection = () => {
  const translate = useTranslate();
  return (
    <ReferenceManyField
      reference="datasets"
      target="url"
      source="url"
      label={translate("resources.catalog.fields.datasets")}
      perPage={10}
      pagination={<Pagination />}
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
