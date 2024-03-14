import axios from "axios";

const SWAPI_BASE_URL = "https://swapi.info/api";

export async function getFilms() {
  const response = await axios.get(`${SWAPI_BASE_URL}/films`);
  return response.data;
}

export async function getPeople() {
  const response = await axios.get(`${SWAPI_BASE_URL}/people`);
  return response.data;
}

export async function getStarships() {
  const response = await axios.get(`${SWAPI_BASE_URL}/starships`);
  return response.data;
}

export async function getFilmById(id: string) {
  const response = await axios.get(`${SWAPI_BASE_URL}/films/${id}`);
  return response.data;
}

export async function getPersonById(id: string) {
  const response = await axios.get(`${SWAPI_BASE_URL}/people/${id}`);
  return response.data;
}

export async function getStarshipById(id: string) {
  const response = await axios.get(`${SWAPI_BASE_URL}/starships/${id}`);
  return response.data;
}
