import { LocalCatalog } from "../types/catalog";

const STORAGE_KEY = "local_catalogs";

export class LocalCatalogService {
  static getCatalogs(): LocalCatalog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveCatalog(
    catalog: Omit<LocalCatalog, "id" | "dateAdded" | "isActive">
  ): LocalCatalog {
    const catalogs = this.getCatalogs();
    const catalogId = this.generateIdFromUrl(catalog.url);

    // Create new catalog (duplicate check should be done at data provider level)
    const newCatalog: LocalCatalog = {
      ...catalog,
      id: catalogId,
      dateAdded: new Date().toISOString(),
      isActive: false,
    };

    catalogs.push(newCatalog);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogs));
    return newCatalog;
  }

  static updateCatalog(
    id: string,
    updates: Partial<LocalCatalog>
  ): LocalCatalog | null {
    const catalogs = this.getCatalogs();
    const index = catalogs.findIndex((c) => c.id === id);

    if (index === -1) return null;

    catalogs[index] = { ...catalogs[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogs));
    return catalogs[index];
  }

  static deleteCatalog(id: string): boolean {
    const catalogs = this.getCatalogs();
    const filteredCatalogs = catalogs.filter((c) => c.id !== id);

    if (filteredCatalogs.length === catalogs.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCatalogs));
    return true;
  }

  static getCatalogById(id: string): LocalCatalog | null {
    const catalogs = this.getCatalogs();
    return catalogs.find((c) => c.id === id) || null;
  }

  static setActiveCatalog(id: string): LocalCatalog | null {
    const catalogs = this.getCatalogs();
    const catalog = catalogs.find((c) => c.id === id);

    if (!catalog) return null;

    // Deactivate all other catalogs
    catalogs.forEach((c) => (c.isActive = false));

    // Activate the selected catalog
    catalog.isActive = true;
    catalog.lastConnected = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogs));
    return catalog;
  }

  static getActiveCatalog(): LocalCatalog | null {
    const catalogs = this.getCatalogs();
    return catalogs.find((c) => c.isActive) || null;
  }

  static deactivateAll(): void {
    const catalogs = this.getCatalogs();
    catalogs.forEach((c) => (c.isActive = false));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogs));
  }

  static updateLastConnected(catalogUrl: string): void {
    const catalogs = this.getCatalogs();
    const catalogId = this.generateIdFromUrl(catalogUrl);
    const catalog = catalogs.find((c) => c.id === catalogId);

    if (catalog) {
      catalog.lastConnected = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogs));
    }
  }

  static async testConnection(
    url: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Test connection by fetching catalog directly from counterPartyAddress
      const response = await fetch(`/api/management/v3/catalog/request`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          "@context": {
            "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
          },
          counterPartyAddress: url,
          protocol: "dataspace-protocol-http",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Connection failed",
      };
    }
  }

  private static generateIdFromUrl(url: string): string {
    // Use base64 encoding of URL as deterministic ID
    // This prevents duplicate catalogs and provides consistent IDs
    return btoa(url);
  }
}
