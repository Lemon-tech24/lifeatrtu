"use client";
import React, { useRef } from "react";
import AddPost from "./overlays/AddPost";
import Form from "./Form";
import DisplayPost from "./DisplayPost";
import { useInfiniteScroll } from "ahooks";
import axios from "axios";

let status = ["ERROR", "BUSY"];
export function getPosts(skip: number, take: number): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post("/api/post/get", {
        skip: skip,
        take: take,
      });

      const data = response.data;
      const newSkip = skip + take;
      console.log("this is post", data);

      if (!status.includes(data)) {
        resolve({
          list: data,
          skip: data && data.length < 4 ? undefined : newSkip,
        });
      } else reject(data);
    } catch (err) {
      console.log(err);
    }
  });
}

function HomeContent() {
  const ref = useRef<HTMLDivElement>(null);
  const { data, mutate, loading, loadMore, noMore, loadingMore } =
    useInfiniteScroll((d) => getPosts(d?.skip ? d?.skip : 0, 4), {
      target: ref,
      isNoMore: (d) => {
        if (d?.skip === undefined) return true;
        else return false;
      },
    });

  console.log("data outside", data);
  return (
    <>
      <AddPost />
      <Form data={data} mutate={mutate} noMore={noMore} />
      <div ref={ref} className="h-32 overflow-auto">
        <DisplayPost
          data={data}
          loading={loading}
          loadMore={loadMore}
          ref={() => ref}
          loadingMore={loadingMore}
        />
      </div>
      {!loading && noMore && "no more"}
    </>
  );
}

export default HomeContent;
