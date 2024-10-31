import commentsApi from "./comments.api";
import diariesApi from "./diaries.api";

import petsApi from "./pets.api";
import profilesAPI from "./profiles.api";

const api = {
  pets: petsApi,
  diaries: diariesApi,
  comments: commentsApi,
  profiles: profilesAPI,
};

export default api;
