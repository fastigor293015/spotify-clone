"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";

import { Playlist } from "@/types";

import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";

interface SidebarProps {
  children: React.ReactNode;
  playlists: Playlist[];
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  playlists
}) => {
  const pathname = usePathname();

  const routes = useMemo(() => [
    {
      icon: HiHome,
      label: "Home",
      active: pathname !== "/search",
      href: "/",
    },
    {
      icon: BiSearch,
      label: "Search",
      active: pathname === "/search",
      href: "/search",
    },
  ], [pathname]);

  return (
    <div className="flex h-full">
      <div
        className="
          hidden
          md:flex
          flex-col
          gap-y-2
          bg-black
          h-full
          w-[300px]
          p-2
        "
      >
        <Box>
          <div
            className="
              flex
              flex-col
              px-3
              py-2
            "
          >
            {routes.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
              />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library playlists={playlists} />
        </Box>
      </div>
      <main className="relative h-full flex-1 overflow-y-auto py-2">
        {children}
      </main>
    </div>
  );
}

export default Sidebar;
