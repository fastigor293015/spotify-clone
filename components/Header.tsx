"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Button from "./Button";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  children,
  className
}) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const router = useRouter();
  const [bgOpacity, setBgOpacity] = useState(0);

  useEffect(() => {
    const main = document.body.querySelector("main")?.querySelector("div");

    const handleScroll = () => {
      if (!main) return;
      console.log(main.scrollTop);
      const newOpacity = main.scrollTop > 150 ? 150 : main?.scrollTop
      setBgOpacity(newOpacity / 150);
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
    // TODO: Reset any playing songs
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
        w-full
        mb-2
        py-4
        px-6
        flex
        items-center
        justify-between
        text-emerald-800
      `, className)}>
        <div className="absolute inset-0 -z-[1] bg-current" style={{ opacity: bgOpacity }} />
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
            <div className="flex gap-x-4 items-center">
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
            </div>
          ) : (
            <>
              <div>
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
              </div>
              <div>
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
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className={twMerge(`
          absolute
          top-0
          w-full
          bg-gradient-to-b
          from-current
          h-80
          text-emerald-800
        `,
          className
        )}
      />
      <div className="relative z-[1] p-6 pt-0">
        {children}
      </div>
    </>
  );
}

export default Header;
