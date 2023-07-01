"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import usePlayer from "@/hooks/usePlayer";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Button from "./buttons/Button";

interface HeaderProps {
  children: React.ReactNode;
  bgcolor?: string;
  stickyContent?: React.ReactNode;
  scrollValue?: number;
}

const Header: React.FC<HeaderProps> = ({
  children,
  bgcolor = "",
  stickyContent,
  scrollValue = 150,
}) => {
  const pathname = usePathname();
  const player = usePlayer();
  const authModal = useAuthModal();
  const router = useRouter();
  const [bgOpacity, setBgOpacity] = useState(0);
  const [stickyContentOpacity, setStickyContentOpacity] = useState(0);

  useEffect(() => {
    const main = document.body.querySelector("main")?.querySelector("div");

    const handleScroll = () => {
      if (!main) return;
      const newOpacity = (main.scrollTop > 250 ? 250 : main?.scrollTop) / 250;
      setBgOpacity(newOpacity);
      const newStickyContentOpacity = main.scrollTop > scrollValue ? 1 : 0;
      setStickyContentOpacity(newStickyContentOpacity);
    }

    // console.log(scrollY)
    main?.addEventListener("scroll", handleScroll);
    return () => main?.removeEventListener("scroll", handleScroll);
  }, []);

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    player.reset();
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out!");
    }
  };

  return (
    <>
      <div className={twMerge(`
        sticky
        top-0
        z-10
        flex
        items-center
        justify-between
        w-full
        h-[68px]
        mb-2
        py-4
        px-6
        gap-2
        text-neutral-900
      `)}>
        <div className="absolute inset-0 -z-[1] bg-current transition-colors duration-300" style={{ opacity: bgOpacity, color: bgcolor }} />
        <div className="
          hidden
          md:flex
          gap-x-2
          items-center
        ">
          <button
            onClick={() => router.back()}
            className="
              rounded-full
              bg-black
              flex
              items-center
              justify-center
              hover:opacity-75
              transition
            "
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="
              rounded-full
              bg-black
              flex
              items-center
              justify-center
              hover:opacity-75
              transition
            "
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>

        {stickyContent && (
          <div className={twMerge(`hidden md:flex flex-1 transition duration-300`, stickyContentOpacity === 0 && "opacity-0 pointer-events-none")}>
            {stickyContent}
          </div>
        )}

        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push("/")}
            className="
              rounded-full
              p-2
              bg-white
              flex
              items-center
              justify-center
              hover:opacity-75
              transition
            "
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            onClick={() => router.push("/search")}
            className="
              rounded-full
              p-2
              bg-white
              flex
              items-center
              justify-center
              hover:opacity-75
              transition
            "
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div
          className="
            flex
            justify-between
            items-center
            gap-x-4
          "
        >
          {user ? (
            <>
              <Button
                onClick={handleLogout}
                className="bg-white px-6 py-2"
              >
                Logout
              </Button>
              <Button
                onClick={() => router.push("/account")}
                className="bg-white"
              >
                <FaUserAlt />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={authModal.onOpen}
                className="
                  bg-transparent
                  text-neutral-300
                  font-medium
                "
              >
                Sign up
              </Button>
              <Button
                onClick={authModal.onOpen}
                className="
                  bg-white
                  px-6
                  py-2
                "
              >
                Log in
              </Button>
            </>
          )}
        </div>
      </div>
      <div
        className={twMerge(`
          absolute
          top-0
          w-full
          h-80
          bg-gradient-to-b
          from-current
          text-neutral-900
          pointer-events-none
          transition-colors
          duration-300
        `, (pathname === "/liked" || pathname.includes("/playlist/")) && "h-[400px]")}
        style={{ color:  bgcolor }}
      />
      <div className="relative z-[1] p-6 pt-0">
        {children}
      </div>
    </>
  );
}

export default Header;
