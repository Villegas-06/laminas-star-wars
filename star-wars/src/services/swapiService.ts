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
