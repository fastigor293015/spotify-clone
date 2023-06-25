"use client";

import usePlaylistEditModal from "@/hooks/usePlaylistEditModal";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { RiMusic2Line } from "react-icons/ri";
import Image from "next/image";
import Input from "../Input";
import Textarea from "../TextArea";
import Button from "../buttons/Button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { HiOutlinePencil } from "react-icons/hi";
import { RxDotsHorizontal } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import DropdownMenu, { DropdownItem } from "../DropdownMenu";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLoadImage from "@/hooks/useLoadImage";

const PlaylistEditModal = () => {
  const router = useRouter();
  const { isOpen, onClose, playlistData } = usePlaylistEditModal();
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset
  } = useForm<FieldValues>({
    defaultValues: {
      image: playlistData?.image_path,
      title: playlistData?.title,
      description: playlistData?.description
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const supabaseClient = useSupabaseClient();

  const image = watch("image");
  const playlistImageUrl = useLoadImage(playlistData?.image_path!);

  useEffect(() => {
    reset({
      image: playlistData?.image_path,
      title: playlistData?.title,
      description: playlistData?.description
    });
  }, [playlistData]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      const { data: supabaseData, error } = await supabaseClient
        .from("playlists")
        .update({
          title: data.title,
          description: data.description,
        })
        .eq("id", playlistData?.id)
        .select();

      console.log(supabaseData);

      if (error) {
        return toast.error(error.message);
      }

      toast.success("Successfully updated!");
      setIsLoading(false);
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  }

  const dropdownItems: DropdownItem[] = [
    {
      label: "Change photo",
      onClick: () => {},
    },
    {
      label: "Remove photo",
      onClick: () => {},
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onChange={onChange}
      title="Edit details"
      className="md:max-w-[524px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-[180px_1fr] grid-rows-[46px_118px_auto_auto] gap-4 mt-8">
        <label
          htmlFor="upload-image"
          className="
            group
            row-span-2
            relative
            flex
            items-center
            justify-center
            h-32
            w-32
            lg:h-[180px]
            lg:w-[180px]
            shadow-4xl
            text-neutral-400
            bg-neutral-800
          "
        >
          {image ? (
            <Image
              fill
              alt="Playlist"
              className="object-cover"
              src={playlistImageUrl!}
            />
          ) : (
            <RiMusic2Line size={50} />
          )}
          <div className={twMerge(`absolute inset-0 flex flex-col items-center justify-center pt-5 text-white bg-neutral-800 opacity-0 hover:opacity-100`, image && "bg-black/70")}>
            <HiOutlinePencil size={50} />
            <p>Choose a photo</p>
          </div>
          <DropdownMenu className="absolute top-2 right-2 rounded-full p-[6px] bg-neutral-900 opacity-0 group-hover:opacity-100" items={dropdownItems} align="start">
            <RxDotsHorizontal size={20} />
          </DropdownMenu>
        </label>
        <Input disabled={isLoading} className="hidden" id="upload-image" type="file" accept="image/.jpg, image/.jpeg, image/.png" onChange={(e) => setValue("image", URL.createObjectURL(e.target.files?.[0]!))} />
        <Input disabled={isLoading} placeholder="Name" {...register("title")} />
        <Textarea className="resize-none" disabled={isLoading} placeholder="Description" {...register("description")} />
        <div className="col-span-2 text-right">
          <Button
            disabled={isLoading}
            type="submit"
            className="
              w-auto
              bg-white
              px-6
              py-2
            "
          >
            Save
          </Button>
        </div>
        <p className="col-span-2 text-[11px] leading-4 font-bold">
          By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image.
        </p>
      </form>
    </Modal>
  );
}

export default PlaylistEditModal;
