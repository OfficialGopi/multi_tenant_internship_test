import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Edit2, Trash2 } from "lucide-react";
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
import { useNotes } from "@/contexts/NotesContext";
import { useUser } from "@/contexts/UserContext";
import { Roles } from "@/constants/roles.constant";

const NoteCard = ({
  note,
}: {
  note: {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
    createdAt: string;
    tenantId: string;
    creatorId: string;
    creator: {
      id: string;
      name: string;
      email: string;
    };
  };
}) => {
  const { user } = useUser();
  const { addOrUpdateNote, isNoteUpdating, isNoteDeleting, deleteNote } =
    useNotes();

  const [formData, setFormData] = useState({
    title: note.title,
    content: note.content,
  });

  const handleEditNote = async (e: React.FormEvent) => {
    e.preventDefault();
    await addOrUpdateNote({
      id: note.id,
      title: formData.title,
      content: formData.content,
    });
    setIsUpdateDialogOpen(false);
  };
  const handleDeleteNote = async (e: React.FormEvent) => {
    e.preventDefault();
    await deleteNote({
      id: note.id,
    });
    setIsDeleteDialogOpen(false);
  };

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <Card className="bg-transparent flex justify-center flex-row p-2">
      <div className="flex-1">
        <CardHeader>
          <CardTitle className="text-2xl">{note.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-lg">{note.content}</CardContent>
        <CardFooter className="flex mt-2  w-full text-sm text-neutral-400  items-start flex-col">
          <span>Created by {note.creator.name}.</span>
          <span>Created at {new Date(note.createdAt).toDateString()}.</span>
          {note.createdAt !== note.updatedAt && (
            <span>
              Last updated at {new Date(note.updatedAt).toDateString()}.
            </span>
          )}
        </CardFooter>
      </div>
      <div className="flex flex-col gap-2">
        {(user?.role === Roles.ADMIN || user?.id === note.creator.id) && (
          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          >
            <DialogTrigger asChild>
              <button className="border p-2 rounded-2xl">
                <Edit2 className="w-5 h-5" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit the Note</DialogTitle>
                <DialogDescription>
                  Edit the note . You can edit the title, content and it will be
                  saved to your tenant.
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
                  onClick={handleEditNote}
                  disabled={isNoteUpdating}
                >
                  {isNoteUpdating ? "Saving..." : "Save"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {(user?.role === Roles.ADMIN || user?.id === note.creator.id) && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <button className="border p-2 rounded-2xl">
                <Trash2 className="w-5 h-5" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete the Note</DialogTitle>
                <DialogDescription>
                  Do you really want to delete the note?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <button className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-900/50 ">
                    Close
                  </button>
                </DialogClose>
                <button
                  className="border p-2 border-neutral-500/50 rounded-md hover:bg-neutral-800 bg-neutral-900"
                  onClick={handleDeleteNote}
                  disabled={isNoteDeleting}
                >
                  {isNoteDeleting ? "Deleting..." : "Delete"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Card>
  );
};

export default NoteCard;
