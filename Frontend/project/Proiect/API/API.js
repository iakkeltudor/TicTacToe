import { requestGet, requestPost } from "./Request";

export const retrieveUsers = () => {
    return requestGet(
      "http://10.132.69.247:8080/api/users/retrieveUsers"  );
  };