import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { getAllProductDummy } from "../Api/Product";
import useFetchList from "../hooks/useFetchList";
import useQuery from "../hooks/useQuery";

const Test = () => {
  const [query, updatequery, resetquery] = useQuery({
    q: "",
    page: 1,
    limit: 10,
    sortBy: "title",
    order: "asc",
  });
  const [pageCount, setPageCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(query.page);

  const [data] = useFetchList("products", query, {}, setPageCount);

  const handleSearch = (data) => {
    console.log(data);
    updatequery({ q: data, page: 1 });
  };
  return (
    <>
      <input type="text" onChange={(e) => handleSearch(e.target.value)} />
      <div>Danh sách sản phẩm</div>
      {data.map((item, id) => {
        return (
          <>
            <h1>Sản phẩm {id + 1}</h1>
            <h4>{item.title}</h4>
            <h4>Giá: {item.price}</h4>
          </>
        );
      })}
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        onPageChange={(e) => updatequery({ page: e.selected + 1 })}
        containerClassName="pagination"
        activeClassName="active"
      />
    </>
  );
};

export default Test;
