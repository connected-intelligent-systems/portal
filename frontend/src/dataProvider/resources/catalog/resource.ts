import { LocalCatalogService } from "../../../services/localCatalogService";
import { LocalCatalog } from "../../../types/catalog";

export async function getList() {
  const catalogs = LocalCatalogService.getCatalogs();
  return {
    data: catalogs,
    total: catalogs.length,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

export async function getOne(params: { id: string }) {
  const catalog = LocalCatalogService.getCatalogById(params.id);
  if (!catalog) {
    throw new Error(`Catalog with id ${params.id} not found`);
  }
  return { data: catalog };
}

export async function create(params: { data: Partial<LocalCatalog> }) {
  const { url, name, description } = params.data;

  if (!url || !name) {
    throw new Error("URL and name are required");
  }

  const catalogId = btoa(url);
  const existingCatalog = LocalCatalogService.getCatalogById(catalogId);
  if (existingCatalog) {
    throw new Error(`A catalog with URL "${url}" already exists`);
  }

  const testResult = await LocalCatalogService.testConnection(url);
  if (!testResult.success) {
    throw new Error(testResult.error || "Connection test failed");
  }

  const catalog = LocalCatalogService.saveCatalog({
    url,
    name,
    description,
  });

  return { data: catalog };
}

export async function update(params: {
  id: string;
  data: Partial<LocalCatalog>;
}) {
  const { id, data } = params;

  if (data.url && data.url !== LocalCatalogService.getCatalogById(id)?.url) {
    const testResult = await LocalCatalogService.testConnection(data.url);
    if (!testResult.success) {
      throw new Error(testResult.error || "Connection test failed");
    }
  }

  const updated = LocalCatalogService.updateCatalog(id, data);
  if (!updated) {
    throw new Error(`Catalog with id ${id} not found`);
  }

  return { data: updated };
}

export async function remove(params: { id: string }) {
  const catalog = LocalCatalogService.getCatalogById(params.id);
  if (!catalog) {
    throw new Error(`Catalog with id ${params.id} not found`);
  }

  const success = LocalCatalogService.deleteCatalog(params.id);
  if (!success) {
    throw new Error(`Failed to delete catalog with id ${params.id}`);
  }

  return { data: catalog };
}
