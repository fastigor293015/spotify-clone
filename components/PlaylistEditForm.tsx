"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import usePlaylistEditModal, { EPlaylistEditInputsIds } from "@/hooks/usePlaylistEditModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { RiMusic2Line } from "react-icons/ri";
import { HiOutlinePencil } from "react-icons/hi";
import { RxDotsHorizontal } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import uniqid from "uniqid";
import Input from "./Input";
import Textarea from "./TextArea";
import DropdownMenu, { DropdownItem } from "./DropdownMenu";
import Button from "./buttons/Button";

const PlaylistEditForm = () => {
  const router = useRouter();
  const { inputId, onClose, playlistData } = usePlaylistEditModal();
  const {
    register,
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
  const imageLabelRef = useRef<HTMLLabelElement | null>(null);
  const titleLabelRef = useRef<HTMLLabelElement | null>(null);
  const descLabelRef = useRef<HTMLLabelElement | null>(null);

  const supabaseClient = useSupabaseClient();

  const title = watch("title");
  const description = watch("description");
  const image = watch("image");

  const isValuesChanged = useMemo(() => title !== playlistData?.title || description !== playlistData?.description || image !== playlistData?.image_path, [title, description, image, playlistData]);

  const uploadedImgBlobUrl = useMemo(() => image?.[0] instanceof File ? URL.createObjectURL(image?.[0]) : "", [image]);

  useEffect(() => {
    if (!inputId || !imageLabelRef.current || !titleLabelRef.current || !descLabelRef.current) return;

    switch (inputId) {
      case imageLabelRef.current.htmlFor:
        imageLabelRef.current.click();
        break;
      case titleLabelRef.current.htmlFor:
        titleLabelRef.current.click();
        break;
      case descLabelRef.current.htmlFor:
        descLabelRef.current.click();
        break;

      default:
        break;
    }

  }, [inputId, imageLabelRef, titleLabelRef, descLabelRef]);

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

      const imageFile = data.image?.[0];

      if (typeof data.image === "string") {
        // Если картинка не была изменена
        const { error: supabaseError } = await supabaseClient
          .from("playlists")
          .update({
            title: data.title,
            description: data.description,
          })
          .eq("id", playlistData?.id);

        if (supabaseError) {
          setIsLoading(false);
          return toast.error(supabaseError.message);
        }
      } else if (!imageFile) {
        // Если картинка была убрана
        const { error: supabaseError } = await supabaseClient
          .from("playlists")
          .update({
            title: data.title,
            description: data.description,
            image_path: null,
          })
          .eq("id", playlistData?.id);

        if (supabaseError) {
          setIsLoading(false);
          return toast.error(supabaseError.message);
        }
      } else {
        // Если была загружена картинка
        const uniqueID = uniqid();

        const { data: imageData, error: imageError } = await supabaseClient
          .storage
          .from("images")
          .upload(`image-playlist${playlistData?.id}-${uniqueID}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (imageError) {
          setIsLoading(false);
          return toast.error("Failed image upload");
        }

        const { error: supabaseError } = await supabaseClient
          .from("playlists")
          .update({
            title: data.title,
            description: data.description,
            image_path: imageData.path,
          })
          .eq("id", playlistData?.id);

        if (supabaseError) {
          setIsLoading(false);
          return toast.error(supabaseError.message);
        }
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

  const dropdownItems: DropdownItem[] = [
    {
      label: "Change photo",
      onClick: () => imageLabelRef.current?.click(),
    },
    {
      label: "Remove photo",
      onClick: () => reset({ image: null }),
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-[180px_1fr] gap-3 sm:gap-4 mt-8">
      <label
        ref={imageLabelRef}
        htmlFor={EPlaylistEditInputsIds.image}
        className="
          group
          relative
          row-span-2
          col-span-2
          sm:col-span-1
          justify-self-center
          flex
          items-center
          justify-center
          h-[180px]
          w-[180px]
          mb-5
          sm:mb-0
          shadow-4xl
          text-neutral-400
          bg-neutral-800
        "
      >
        <Input id={EPlaylistEditInputsIds.image} className="hidden" disabled={isLoading} type="file" accept="image/.jpg, image/.jpeg, image/.png" {...register("image")} />
        {image ? (
          <Image
            fill
            alt="Playlist"
            className="object-cover"
            src={typeof image === "string" ? image : uploadedImgBlobUrl}
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
      <label ref={titleLabelRef} htmlFor={EPlaylistEditInputsIds.title} className="col-span-2 sm:col-span-1">
        <Input id={EPlaylistEditInputsIds.title} className="h-[40px]" maxLength={100} disabled={isLoading} placeholder="Name" {...register("title")} />
      </label>
      <label ref={descLabelRef} htmlFor={EPlaylistEditInputsIds.description} className="col-span-2 sm:col-span-1">
        <Textarea id={EPlaylistEditInputsIds.description} className="resize-none h-[124px]" maxLength={300} disabled={isLoading} placeholder="Description" {...register("description")} />
      </label>

      <div className="col-span-2 text-right">
        <Button
          disabled={isLoading || !isValuesChanged}
          type="submit"
          className="
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
  );
}

export default PlaylistEditForm;
