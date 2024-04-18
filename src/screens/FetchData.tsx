import React, { useEffect, useState } from "react";

interface ApiResponse {
  result: any[];
}

const FetchData = () => {
  const [data, setData] = useState<ApiResponse>({ result: [] });
  useEffect(() => {
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      method: "GET",
      headers: {
        "X-API-KEY": "8p4u41oTJafyIxjrUWM6p1rnFV0ACyYFV8jFNkZt",
      },
    })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => alert("error"));
  }, []);
  console.log(data);
  if (data.result.length === 0) {
    return <div>Loading...</div>;
  }
  const renderPref = data.result.map((item)=>{
    return(
      <div key={item.prefCode}>{item.prefName}</div>
    );
  })
  return <div>{renderPref}</div>;
};

export default FetchData;
