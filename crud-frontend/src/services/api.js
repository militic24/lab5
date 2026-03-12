import axios from "axios";

const API_URL = "http://localhost:5000/api/countries";

export const getCountries = async () => (await axios.get(API_URL)).data;

export const createCountry = async (country) =>
  (await axios.post(API_URL, country)).data;

export const updateCountry = async (id, country) =>
  (await axios.put(`${API_URL}/${id}`, country)).data;

export const deleteCountry = async (id) =>
  (await axios.delete(`${API_URL}/${id}`)).data;