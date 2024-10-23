import commentsApi from "./comments.api";
import diariesApi from "./diaries.api";

import petsApi from "./pets.api";

const api = {
  pets: petsApi,
  diaries: diariesApi,
  comments: commentsApi,
};

export default api;
