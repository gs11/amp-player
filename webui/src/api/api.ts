import { Types } from "../types";

export enum ApiState {
  IDLE,
  LOADING,
  ERROR,
}

export const API_HOST =
  window.location.hostname === "localhost"
    ? `${window.location.origin}/local/api`
    : `${window.location.origin}/api`;

const getFromAPI = async (path: string, query?: any): Promise<Response> => {
  const url = new URL(`${API_HOST}${path}`);
  if (query) {
    url.search = new URLSearchParams(query).toString();
  }
  var response = await fetch(url);
  if (response.status !== 200) {
    throw new Error(`API call failed with status code $ {response.status}`);
  } else {
    return response;
  }
};

export const search = async (query: string): Promise<Types.Artist[]> => {
  const response = await getFromAPI("/artists", { query: query });
  return (await response.json()) as Types.Artist[];
};

export const getArtistModules = async (
  artistId: number
): Promise<Types.Module[]> => {
  const response = await getFromAPI(`/artists/${artistId}/modules`);
  return (await response.json()) as Types.Module[];
};

export const getModuleBytes = async (
  moduleId: number
): Promise<ArrayBuffer> => {
  const response = await getFromAPI(`/modules/${moduleId}`);
  return response.arrayBuffer();
};
