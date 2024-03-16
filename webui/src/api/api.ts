import { Artist, Module } from "../types";

export enum ApiState {
  IDLE,
  LOADING,
  ERROR,
}

console.log(window.location);

export const API_HOST =
  window.location.hostname === "localhost"
    ? `${window.location.origin}/local/api`
    : `${window.location.origin}/api`;

const getFromAPI = async (path: string, query?: any): Promise<object> => {
  const url = new URL(`${API_HOST}${path}`);
  if (query) {
    url.search = new URLSearchParams(query).toString();
  }
  var response = await fetch(url);
  if (response.status !== 200) {
    throw new Error(`API call failed with status code $ {response.status}`);
  } else {
    return response.json();
  }
};

export const search = async (query: string): Promise<Artist[]> => {
  return (await getFromAPI("/artists", { query: query })) as Artist[];
};

export const getArtistModules = async (artistId: number): Promise<Module[]> => {
  return (await getFromAPI(`/artists/${artistId}/modules`)) as Module[];
};
