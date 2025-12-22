import { useEffect, useState } from "react";
import { api } from "../Api/Api";

const useFetchAll = (path, initialData = null, config = {}) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchAPI = async () => {
      try {
        const res = await api.get(path, config);
        setData(res.data.data);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAPI();
  }, [path, JSON.stringify(config)]);

  return { data, loading };
};


export default useFetchAll;
