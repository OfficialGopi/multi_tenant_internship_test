"use client";
import { Roles } from "@/generated/prisma";
import { Loader2, LogOut, Plus, Rocket, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
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
import NoteCard from "./NoteCard";
import { useUser } from "@/contexts/UserContext";
import { useNotes } from "@/contexts/NotesContext";

const MainPage = () => {
  const [isNoteCreateDialogOpen, setIsNoteCreateDialogOpen] = useState(false);
  const [isInviteMemberDialogOpen, setIsInviteMemberDialogOpen] =
    useState(false);

  const { user, logoutUser, inviteMember, isInviteMemberLoading } = useUser();
  const { notes, addOrUpdateNote, isNoteAdding, getNotes, isNotesLoading } =
    useNotes();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [inviteData, setInviteData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    await addOrUpdateNote({
      title: formData.title,
      content: formData.content,
    });
    setFormData({
      title: "",
      content: "",
    });
    setIsNoteCreateDialogOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
  };
  const handleInviteMember = async () => {
    await inviteMember({
      name: inviteData.name,
      email: inviteData.email,
      password: inviteData.password,
    });

    setIsInviteMemberDialogOpen(false);
    setInviteData({
      email: "",
      password: "",
      name: "",
    });
  };

  useEffect(() => {
    getNotes();
  }, []);

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
          {user?.role === Roles.ADMIN && (
            <Dialog
              open={isInviteMemberDialogOpen}
              onOpenChange={setIsInviteMemberDialogOpen}
            >
              <DialogTrigger asChild>
                <button className="flex items-center gap-1 justify-center cursor-pointer text-sm hover:text-neutral-300 transition-[transform_color] group border p-2 border-neutral-500/50 rounded-md pr-4">
                  <UserPlus className="w-5 h-5" />
                  <span className="group-hover:translate-x-[5px] transition-[transform_color]">
                    Invite a member
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite a member</DialogTitle>
                  <DialogDescription>
                    Invite a member to your tenant to collaborate on notes
                  </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="p-2 border border-neutral-500/50 rounded-lg text-sm"
                      placeholder="Enter the note title"
                      value={inviteData.name}
                      onChange={(e) => {
                        setInviteData({
                          ...inviteData,
                          name: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="p-2 border border-neutral-500/50 rounded-lg text-sm"
                      placeholder="Enter the note content"
                      value={inviteData.email}
                      onChange={(e) => {
                        setInviteData({
                          ...inviteData,
                          email: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="p-2 border border-neutral-500/50 rounded-lg text-sm"
                      placeholder="Enter the note content"
                      value={inviteData.password}
                      onChange={(e) => {
                        setInviteData({
                          ...inviteData,
                          password: e.target.value,
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
                  <button
                    className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-800 bg-neutral-900"
                    onClick={handleInviteMember}
                    disabled={isInviteMemberLoading}
                  >
                    {isInviteMemberLoading ? "Inviting..." : "Invite"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Dialog
            open={isNoteCreateDialogOpen}
            onOpenChange={setIsNoteCreateDialogOpen}
          >
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
                <button
                  className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-800 bg-neutral-900"
                  onClick={handleCreateNote}
                  disabled={isNoteAdding}
                >
                  {isNoteAdding ? "Saving..." : "Save"}
                </button>
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
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
      <div className="flex flex-col gap-2 mt-2">
        {isNotesLoading ? (
          <Loader2 className="animate-spin  mx-auto" />
        ) : notes.length === 0 ? (
          <></>
        ) : (
          notes.map(
            (
              note: {
                id: string;
                title: string;
                content: string;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
              },
              idx: number
            ) => {
              return <NoteCard key={note.id} note={note} />;
            }
          )
        )}
      </div>
    </div>
  );
};

export default MainPage;
