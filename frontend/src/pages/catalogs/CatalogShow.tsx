import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  EditButton,
  TopToolbar,
  ReferenceManyField,
  useTranslate,
  Pagination,
  useRecordContext,
  SelectInput,
  FilterForm,
  TextInput,
  useListContext,
} from "react-admin";
import { Box, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { getCategories } from "../../dataProvider/resources/datasets";
import { DatasetCard } from "./DatasetCard";
import { Dataset } from "../../types/catalog";

const CatalogShowActions = () => (
  <TopToolbar>
    <EditButton />
  </TopToolbar>
);

const DatasetsWithFilters = () => {
  const catalogRecord = useRecordContext();
  const catalogUrl = catalogRecord?.url;
  const { data } = useListContext();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    if (catalogUrl) {
      getCategories(catalogUrl)
        .then((cats) => {
          setCategories(cats.map((cat) => ({ id: cat, name: cat })));
        })
        .catch((error) => {
          console.error("Error loading categories:", error);
          setCategories([]);
        });
    }
  }, [catalogUrl]);

  const filters = [
    <TextInput key="q" source="q" label="Search" alwaysOn resettable />,
    <SelectInput
      key="category"
      source="category"
      label="Category"
      choices={categories}
      alwaysOn
    />,
  ];

  return (
    <Box>
      <FilterForm filters={filters} />
      <Grid container spacing={2} sx={{ mt: 1 }}>
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
  return (
    <ReferenceManyField
      reference="datasets"
      target="url"
      source="url"
      label="Datasets"
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
        <TextField source="name" label="Name" />
        <TextField source="url" label="URL" />
        <TextField source="description" label="Description" />
        <DateField source="dateAdded" label="Date Added" showTime />
        <DateField source="lastConnected" label="Last Connected" showTime />

        <DatasetsSection />
      </SimpleShowLayout>
    </Show>
  );
};
