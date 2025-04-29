import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import {
  Calendar,
  ListCheck,
  LogOut,
  Menu,
  Notebook,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { auth } from "@/auth/firebaseClient";
import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocalNoTime } from "@/utils/date";

function HeaderMenu() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const page = usePageStore((state) => state.page);
  const setIsModalOpen = usePageStore((state) => state.setIsModalOpen);

  const queryClient = useQueryClient();

  const today = formatDateLocalNoTime(new Date());

  // Handle navigation
  const handleNavigation = async (path: string) => {
    try {
      await router.push(path);
      setIsOpen(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error navigating to", path, error);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries();

      // Close the modal
      setIsOpen(false);
      setIsModalOpen(false);

      // Remove the token from cookies
      Cookies.remove("token");
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  // Handle the modal open and close
  function open() {
    setIsOpen(true);
    setIsModalOpen(true);
  }

  function close() {
    setIsOpen(false);
    setIsModalOpen(false);
  }

  return (
    <>
      <div>
        <Button
          onClick={open}
          className={clsx(
            "peer rounded-full border bg-neutral-100 p-2 hover:cursor-pointer hover:border-neutral-800 hover:bg-neutral-200",
            {
              "border-neutral-800 bg-neutral-200": isOpen,
              "border-transparent": !isOpen,
            },
          )}
        >
          <Menu />
        </Button>
        <div className="pointer-events-none absolute -top-8 -right-2 z-10 rounded bg-neutral-400 px-2 py-1 text-sm whitespace-nowrap opacity-0 transition-opacity delay-300 duration-150 peer-hover:opacity-100">
          Menu
        </div>
      </div>

      <Dialog open={isOpen} as="div" className="relative z-20" onClose={close}>
        <div className="fixed inset-0 w-screen overflow-y-auto backdrop-blur-xs">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl border-2 bg-neutral-100 p-4"
            >
              <div className="flex w-full flex-col justify-between gap-4 p-4">
                <button
                  onClick={() => handleNavigation("/calendar")}
                  className={clsx("navBtn", page === "calendar" && "selected")}
                >
                  <Calendar />
                  <span>Calendar</span>
                </button>
                <button
                  onClick={() => handleNavigation(`/calendar/${today}`)}
                  className={clsx("navBtn", page === "today" && "selected")}
                >
                  <ListCheck />
                  <span>Today</span>
                </button>
                <button
                  onClick={() => handleNavigation("/notes")}
                  className={clsx("navBtn", page === "notes" && "selected")}
                >
                  <Notebook />
                  <span>Notes</span>
                </button>
                <button
                  onClick={() => handleNavigation("/user")}
                  className={clsx("navBtn", page === "user" && "selected")}
                >
                  <User />
                  <span>User</span>
                </button>
                <button onClick={handleSignOut} className="sidebar-item">
                  <LogOut />
                  <span>Sign out</span>
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default HeaderMenu;
