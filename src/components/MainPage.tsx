"use client";
import { Roles } from "@/generated/prisma";
import { Loader2, LogOut, Plus, Rocket, UserPlus, Menu, X } from "lucide-react";
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
import UpgradeToProCard from "./UpgradeToProCard";
import { cn } from "@/utils/cn";

const MainPage = () => {
  const [isUpgradingToProDialogOpen, setIsUpgradingToProDialogOpen] =
    useState(false);
  const [isNoteCreateDialogOpen, setIsNoteCreateDialogOpen] = useState(false);
  const [isInviteMemberDialogOpen, setIsInviteMemberDialogOpen] =
    useState(false);
  const [isUpgradeToProCardOpen, setIsUpgradeToProCardOpen] = useState(true);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const {
    user,
    logoutUser,
    inviteMember,
    isInviteMemberLoading,
    isUpgradingToPro,
    upgradeToPro,
    tenant,
    isTenantLoading,
  } = useUser();
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

  const handleUpgradeToPro = async () => {
    await upgradeToPro();
    setIsUpgradingToProDialogOpen(false);
  };

  useEffect(() => {
    getNotes();
  }, []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="max-w-5xl mx-auto ">
      {!tenant?.isPro && notes.length === 3 && (
        <UpgradeToProCard
          isDialogOpen={isUpgradeToProCardOpen}
          setIsDialogOpen={setIsUpgradeToProCardOpen}
        />
      )}
      <nav className="py-2 flex items-center justify-between border-b border-neutral-500/50 w-full gap-5 sticky top-0  bg-neutral-950/50 backdrop-blur-2xl">
        <h1 className="text-2xl font-semibold p-2">Notes</h1>

        <div className="lg:flex hidden items-center justify-center gap-5 p-2">
          {isTenantLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              {user?.role === Roles.ADMIN && !tenant?.isPro && (
                <Dialog
                  open={isUpgradingToProDialogOpen}
                  onOpenChange={setIsUpgradingToProDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1 justify-center cursor-pointer text-sm hover:text-neutral-300 transition-[transform_color] group border p-2 border-neutral-500/50 rounded-md pr-4">
                      <Rocket className="w-5 h-5" />
                      <span className="group-hover:translate-x-[5px] transition-[transform_color]">
                        Upgrade to pro
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upgrade to pro</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to upgrade this tenant to pro?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-900/50 ">
                          Cancel
                        </button>
                      </DialogClose>
                      <button
                        className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-800 bg-neutral-900"
                        onClick={handleUpgradeToPro}
                        disabled={isUpgradingToPro}
                      >
                        {isUpgradingToPro ? "Upgrading..." : "Upgrade"}
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {tenant?.isPro && (
                <div className="flex items-center gap-1 justify-center  text-sm  border p-2 border-neutral-500/50 rounded-md pr-4">
                  <Rocket className="w-5 h-5" />
                  <span className=" ">You are a pro</span>
                </div>
              )}
            </>
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

          <Dialog
            open={isLogoutDialogOpen}
            onOpenChange={setIsLogoutDialogOpen}
          >
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

        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className={cn(
            "lg:hidden overflow-hidden bg-neutral-950 transition-[height] backdrop-blur-2xl border-b border-neutral-500/50 p-4 space-y-3"
          )}
        >
          {isTenantLoading ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              {user?.role === Roles.ADMIN && !tenant?.isPro && (
                <Dialog
                  open={isUpgradingToProDialogOpen}
                  onOpenChange={setIsUpgradingToProDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button
                      className="flex items-center gap-2 w-full justify-center cursor-pointer text-sm hover:text-neutral-300 transition-[transform_color] group border p-2 border-neutral-500/50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Rocket className="w-5 h-5" />
                      <span className="group-hover:translate-x-[5px] transition-[transform_color]">
                        Upgrade to pro
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upgrade to pro</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to upgrade this tenant to pro?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-900/50 ">
                          Cancel
                        </button>
                      </DialogClose>
                      <button
                        className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-800 bg-neutral-900"
                        onClick={handleUpgradeToPro}
                        disabled={isUpgradingToPro}
                      >
                        {isUpgradingToPro ? "Upgrading..." : "Upgrade"}
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {tenant?.isPro && (
                <div className="flex items-center gap-2 justify-center text-sm border p-2 border-neutral-500/50 rounded-md">
                  <Rocket className="w-5 h-5" />
                  <span>You are a pro</span>
                </div>
              )}
            </>
          )}

          {user?.role === Roles.ADMIN && (
            <Dialog
              open={isInviteMemberDialogOpen}
              onOpenChange={setIsInviteMemberDialogOpen}
            >
              <DialogTrigger asChild>
                <button
                  className="flex items-center gap-2 w-full justify-center cursor-pointer text-sm hover:text-neutral-300 transition-[transform_color] group border p-2 border-neutral-500/50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
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
              <button
                className="flex items-center gap-2 w-full justify-center cursor-pointer text-sm hover:text-neutral-300 transition-[transform_color] group border p-2 border-neutral-500/50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
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

          <Dialog
            open={isLogoutDialogOpen}
            onOpenChange={setIsLogoutDialogOpen}
          >
            <DialogTrigger asChild>
              <button
                className="flex items-center gap-2 w-full justify-center cursor-pointer text-sm hover:text-neutral-300 transition-[transform_color] group border p-2 border-neutral-500/50 rounded-md"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLogoutDialogOpen(true);
                }}
              >
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
      )}
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
