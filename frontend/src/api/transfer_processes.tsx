import { HttpError } from "react-admin";

/**
 * Fetches transfer processes from the server.
 *
 * @param pagination - The pagination options for fetching the transfer processes.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchTransferProcesses = async (pagination: any, sort: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const { field, order }: { field: number; order: string } = sort;
  const response = await fetch(
    `/api/portal/transferprocesses?page=${page}&page_size=${perPage}&field=${field}&order=${order}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

/**
 * Fetches a transfer process by its ID from the server.
 *
 * @param id - The ID of the transfer process to fetch.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchTransferProcess = async (id: string) => {
  const response = await fetch(`/api/portal/transferprocesses/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

/**
 * Creates a transfer process by sending a POST request to the specified API endpoint.
 * @param {any} data - The data to be sent in the request body.
 * @returns {Promise<any>} - A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} - If the response status is not ok, an HttpError is thrown with the error message and status code.
 */
export const createTransferProcess = async (data: any): Promise<any> => {
  const response = await fetch(`/api/portal/transferprocesses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

/**
 * Fetches transfer process data request from the server.
 *
 * @param id - The ID of the transfer process.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the response status is not ok.
 */
export const fetchTransferProcessDataRequest = async (id: string) => {
  const response = await fetch(
    `/api/portal/transferprocesses/${id}/datarequest`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};
/**
 * Fetches data for visualization  from the server.
 *
 * @param id - The ID of the transfer process.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the response status is not ok.
 */
export const fetchTransferProcessDataConsumerPull = async (id: string) => {
  const response = await fetch(`/api/portal/transferprocesses/${id}/data`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

/**
 * Fetches raw data  from the server.
 *
 * @param id - The ID of the transfer process.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the response status is not ok.
 */
export const fetchRawDataConsumerPull = async (id: string) => {
  const response = await fetch(`/api/portal/transferprocesses/${id}/download`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};
/**
 * Terminates a transfer process.
 *
 * @param {string} id - The ID of the transfer process to terminate.
 * @param {string} reason - The reason for terminating the transfer process.
 * @returns {Promise<any>} - A promise that resolves to the JSON response from the server.
 * @throws {HttpError} - If the server returns an error response.
 */
export const terminateTransferProcess = async (
  id: string,
  reason: string
): Promise<any> => {
  const response = await fetch(
    `/api/portal/transferprocesses/${id}/terminate`,
    {
      method: "POST",
      body: JSON.stringify({
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
        "@type": "https://w3id.org/edc/v0.0.1/ns/TerminateTransfer",
        "@id": id,
        reason: reason,
      }),
    }
  );
  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};
