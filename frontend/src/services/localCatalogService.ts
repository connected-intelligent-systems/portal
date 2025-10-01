import { LocalCatalog } from "../types/catalog";
import * as catalogDataProvider from "../dataProvider/resources/catalog";

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
    const newCatalog: LocalCatalog = {
      ...catalog,
      id: this.generateId(),
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
    const catalog = catalogs.find((c) => c.url === catalogUrl);

    if (catalog) {
      catalog.lastConnected = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogs));
    }
  }

  static async testConnection(
    url: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Use the catalog dataProvider's getOne method to test the connection
      await catalogDataProvider.getOne({ id: url });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Connection failed",
      };
    }
  }

  private static generateId(): string {
    return `catalog_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 11)}`;
  }
}
