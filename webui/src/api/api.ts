import { Artist, Module } from "../types";

export enum ApiState {
  IDLE,
  LOADING,
  ERROR,
}

export const API_HOST =
  window.location.hostname === "localhost"
    ? "http://localhost:4000/local/api"
    : "https://d399hvxgs7b3lz.cloudfront.net/api";

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
