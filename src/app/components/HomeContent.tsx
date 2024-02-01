"use client";
import React, { useEffect, useRef, useState } from "react";
import AddPost from "./overlays/AddPost";
import Form from "./Form";
import DisplayPost from "./DisplayPost";
import { useInfiniteScroll } from "ahooks";
import axios from "axios";
import { isOpenLogout } from "@/utils/Overlay/Logout";
import Logout from "@/app/components/overlays/Logout";
import { useSession } from "next-auth/react";

let status = ["ERROR", "BUSY"];

export function getPosts(
  skip: number,
  take: number,
  order: string
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post("/api/post/get", {
        skip: skip,
        take: take,
        order: order,
      });

      const data = response.data;
      const newSkip = skip + take;

      if (!status.includes(data)) {
        resolve({
          list: data,
          skip: data && data.length < 10 ? undefined : newSkip,
        });
      } else reject(data);
    } catch (err) {
      console.log(err);
    }
  });
}

function HomeContent() {
  const ref = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [select, setSelect] = useState<string>("desc");
  const { open } = isOpenLogout();
  const { data: session } = useSession();

  const { data, mutate, loading, loadMore, noMore, loadingMore, reload } =
    useInfiniteScroll((d) => getPosts(d?.skip ? d?.skip : 0, 10, select), {
      target: ref,
      isNoMore: (d) => {
        if (d?.skip === undefined) return true;
        else return false;
      },
      reloadDeps: [keyword],
    });

  useEffect(() => {
    const handleFocus = () => {
      reload();
    };

    window.addEventListener("focus", handleFocus);

    reload();

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [keyword, select]);

  useEffect(() => {
    if (session) {
      localStorage.setItem("id", session.user.id);
    }
  }, []);

  return (
    <div className="w-full h-full">
      {open && <Logout />}

      <AddPost />
      <Form
        data={data}
        mutate={mutate}
        noMore={noMore}
        loadMore={loadMore}
        setKeyword={setKeyword}
        keyword={keyword}
      />
      <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setSelect(e.target.value)
        }
        defaultValue={"desc"}
      >
        <option value="desc">Recently</option>
        <option value="asc">Oldest</option>
        <option value="likes">Most Liked</option>
        <option value="engages">Most Engaged</option>
        <option value="comments">Most Commented</option>
      </select>
      <div ref={ref} className="m-auto w-p-88 h-p-90 overflow-y-auto">
        <DisplayPost
          data={data}
          loading={loading}
          loadMore={loadMore}
          loadingMore={loadingMore}
          mutate={mutate}
          reload={reload}
          noMore={noMore}
        />
      </div>
      <div className="w-10/12 m-auto">{!loading && noMore && "no more"}</div>
    </div>
  );
}

export default HomeContent;
