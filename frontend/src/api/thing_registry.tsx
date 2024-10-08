import { HttpError } from "react-admin";

/**
 * Fetches things from the API based on pagination parameters.
 *
 * @param pagination - The pagination parameters.
 * @returns A Promise that resolves to the fetched things.
 * @throws {HttpError} If the API response is not successful.
 */
export const fetchThings = async (pagination: any, sort: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const response = await fetch(
    `/api/registry/things?page=${page}&page_size=${perPage}&sort_order=${sort.order.toLowerCase()}&sort_by=${
      sort.field
    }`
  );

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

/**
 * Fetches a thing from the API registry by its ID.
 *
 * @param id - The ID of the thing to fetch.
 * @returns A Promise that resolves to the fetched thing.
 * @throws {HttpError} If the API request fails.
 */
export const fetchThing = async (id: string) => {
  const response = await fetch(`/api/registry/things/${id}`);

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

/**
 * Updates a thing in the registry.
 *
 * @param {string} id - The ID of the thing to update.
 * @param {any} thing - The updated thing object.
 * @returns {Promise<any>} - A promise that resolves to the updated thing object.
 * @throws {HttpError} - If the HTTP response is not successful.
 */
export const updateThing = async (id: string, thing: any): Promise<any> => {
  const response = await fetch(`/api/registry/things/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: thing,
    method: "PUT",
  });

  if (response.ok === false) {
    throw new HttpError(response.statusText, response.status);
  }

  return thing;
};

/**
 * Deletes a thing from the registry.
 * @param {any} id - The ID of the thing to delete.
 * @throws {HttpError} If the delete request fails.
 */
export const deleteThing = async (id: any) => {
  const response = await fetch(`/api/registry/things/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });

  if (response.ok === false) {
    throw new HttpError(response.statusText, response.status);
  }
};

/**
 * Creates a new thing in the registry.
 * @param {any} thing - The thing object to be created.
 * @returns {Promise<any>} - A promise that resolves to the created thing.
 * @throws {HttpError} - If the response status is not ok.
 */
export const createThing = async (thing: any): Promise<any> => {
  const response = await fetch(`/api/registry/things`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: thing,
    method: "POST",
  });

  if (response.ok === false) {
    throw new HttpError(response.statusText, response.status);
  }

  return response.json();
};
