import React, { useEffect, useState } from "react";
import { api, apiDummy } from "../Api/Api";

const useFetchList = (path, query, config = {}, setPageCount) => {
  const [data, setdata] = useState([]);
  useEffect(() => {
    const FetchAPI = async () => {
      const skip = (query.page - 1) * query.limit;
      query.skip = skip;
      const queryString = new URLSearchParams(query).toString();
      const res = await apiDummy.get(`${path}/search?${queryString}`, config);
      setdata(res.data[path]);
      setPageCount(Math.ceil(res.data.total / query.limit));
    };
    FetchAPI();
  }, [path, JSON.stringify(query), JSON.stringify(config)]);
  return [data];
};

export default useFetchList;
