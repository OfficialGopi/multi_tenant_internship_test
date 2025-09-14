"use client";
import { Roles } from "@/generated/prisma";
import { LogOut, Plus, Rocket } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";

const MainPage = ({
  user,
  tenant,
}: {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
  };
  tenant: {
    id: string;
    name: string;
    isPro: boolean;
    slug: string;
    totalNotes: number;
  };
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [isNoteCreating, setIsNoteCreating] = useState(false);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNoteCreating(true);
    const toastId = toast.loading("Creating note...");
    try {
      const res = await (
        await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      ).json();

      if (res.success) {
        toast.success("Note creation successful", {
          id: toastId,
        });
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsNoteCreating(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto ">
      <nav className="py-2 flex items-center justify-between border-b border-neutral-500/50 w-full gap-5">
        <h1 className="text-2xl font-semibold ">Notes</h1>
        <div className="flex items-center justify-center gap-5">
          {user?.role === Roles.ADMIN && (
            <button className="flex items-center gap-1 justify-center cursor-pointer text-sm hover:text-neutral-300 transition-[transform_color] group border p-2 border-neutral-500/50 rounded-md pr-4">
              <Rocket className="w-5 h-5" />
              <span className="group-hover:translate-x-[5px] transition-[transform_color]">
                Upgrade to pro
              </span>
            </button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 justify-center cursor-pointer text-sm hover:text-neutral-300 transition-[transform_color] group border p-2 border-neutral-500/50 rounded-md pr-4">
                <Plus className="w-5 h-5" />
                <span className="group-hover:translate-x-[5px] transition-[transform_color]">
                  Add a note
                </span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a Note</DialogTitle>
                <DialogDescription>
                  Add a new note to your tenant. You can add a title, content
                  and it will be saved to your tenant.
                </DialogDescription>
              </DialogHeader>
              <form className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="p-2 border border-neutral-500/50 rounded-lg text-sm"
                    placeholder="Enter the note title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="Content">Content</label>
                  <textarea
                    className="p-2 border border-neutral-500/50 rounded-lg text-sm"
                    placeholder="Enter the note content"
                    value={formData.content}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        content: e.target.value,
                      });
                    }}
                  />
                </div>
              </form>
              <DialogFooter>
                <DialogClose asChild>
                  <button className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-900/50 ">
                    Close
                  </button>
                </DialogClose>
                <DialogClose asChild>
                  <button
                    className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-800 bg-neutral-900"
                    onClick={handleCreateNote}
                  >
                    Save
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 justify-center cursor-pointer text-sm hover:text-neutral-300 transition-[transform_color] group border p-2 border-neutral-500/50 rounded-md pr-4">
                <LogOut className="w-5 h-5" />
                <span className="group-hover:translate-x-[5px] transition-[transform_color]">
                  Logout
                </span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Logout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to logout?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <button className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-900/50 ">
                    Close
                  </button>
                </DialogClose>
                <DialogClose asChild>
                  <button
                    className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-800 bg-neutral-900"
                    onClick={handleCreateNote}
                  >
                    Logout
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </div>
  );
};

export default MainPage;
