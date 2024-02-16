"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";
import { Capitalize } from "@/utils/Capitalize";
import { isOpenLogout } from "@/utils/Overlay/Logout";
import { FaBell } from "react-icons/fa";
import { isOpenNotif } from "@/utils/Overlay/Notification";
import Notification from "@/app/components/overlays/Notification";
import axios from "axios";
import toast from "react-hot-toast";
import { useRequest } from "ahooks";

function Navigation() {
  const { data: session, status } = useSession();
  const { open } = isOpenLogout();
  const notif = isOpenNotif();
  const [resData, setResData] = useState<any>();

  const getNotif = new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post("/api/post/get/notif");

      const data = response.data;

      if (data.ok) {
        resolve(data);
      }
      return reject();
    } catch (err) {
      console.error(err);
    }
  });

  const notifs = useRequest(() => getNotif);

  return (
    <div className="flex items-center justify-between p-2 px-8 w-full font-bold">
      <div className="text-4xl">
        Hello,{" "}
        {status === "loading"
          ? "Loading"
          : session && Capitalize(session?.user?.name).split(" ")[0]}
      </div>
      <div className=" relative flex items-center justify-center gap-4">
        {notif.value && (
          <Notification loading={notifs.loading} data={notifs.data} />
        )}
        <div
          className="text-3xl cursor-pointer flex items-center"
          onClick={() => notif.change()}
        >
          <FaBell style={{ width: 50 }} />
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default Navigation;
