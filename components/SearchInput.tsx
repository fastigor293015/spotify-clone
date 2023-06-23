"use client";

import qs from "query-string";

import useDebounce from "@/hooks/useDebounce";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "./Input";

const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 500);

  useEffect(() => {
    if (!debouncedValue) return router.replace(pathname);

    const query = {
      title: debouncedValue,
    }

    const url = qs.stringifyUrl({
      url: pathname,
      query: query
    });

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <Input
      placeholder="What do you want to listen to?"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default SearchInput;
