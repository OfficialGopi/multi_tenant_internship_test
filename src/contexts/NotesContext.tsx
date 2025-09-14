"use client";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

const NotesContext = createContext<{
  notes: {
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
  }[];
  isNotesLoading: boolean;
  isNoteDeleting: boolean;
  isNoteAdding: boolean;
  isNoteUpdating: boolean;
  getNotes: () => Promise<void>;
  addOrUpdateNote: (data: {
    id?: string;
    title: string;
    content: string;
  }) => Promise<void>;
  deleteNote: ({ id }: { id: string }) => Promise<void>;
}>({
  notes: [],
  isNotesLoading: false,
  isNoteDeleting: false,
  isNoteAdding: false,
  isNoteUpdating: false,
  getNotes: async () => {},
  addOrUpdateNote: async () => {},
  deleteNote: async ({}) => {},
});

const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<
    {
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
    }[]
  >([]);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [isNoteDeleting, setIsNoteDeleting] = useState(false);
  const [isNoteAdding, setIsNoteAdding] = useState(false);
  const [isNoteUpdating, setIsNoteUpdating] = useState(false);

  const addOrUpdateNote = async ({
    id,
    title,
    content,
  }: {
    id?: string;
    title: string;
    content: string;
  }) => {
    const toastId = toast.loading("Creating note...");

    try {
      let method: "POST" | "PUT" = "POST";
      let url: string = "/api/notes";
      if (id) {
        setIsNoteUpdating(true);
        method = "PUT";
        url = `/api/notes/${id}`;
      } else {
        setIsNoteAdding(true);
        method = "POST";

        if (
          title.trim() === "" ||
          content.trim() === "" ||
          !title ||
          !content
        ) {
          toast.error("Title and content are required");
          return;
        }
      }

      const res = await (
        await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        })
      ).json();

      if (res.success) {
        if (id) {
          toast.success("Note updated successful", {
            id: toastId,
          });
        } else {
          toast.success("Note creation successful", {
            id: toastId,
          });
        }
        const responseNote = res.data.note;
        if (!id) {
          setNotes([responseNote, ...notes]);
        } else {
          const updatedNotes = notes.map((note) => {
            if (note.id === id) {
              return responseNote;
            }
            return note;
          });
          setNotes(updatedNotes);
        }
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch {
      toast.error("Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsNoteAdding(false);
      setIsNoteUpdating(false);
    }
  };

  const getNotes = async () => {
    setIsNotesLoading(true);
    try {
      const res = await (
        await fetch("/api/notes", {
          method: "GET",
        })
      ).json();

      if (res.success) {
        setNotes(res.data.notes);
      } else {
        setNotes([]);
      }
    } catch {
      setNotes([]);
    } finally {
      setIsNotesLoading(false);
    }
  };

  const deleteNote = async ({ id }: { id: string }) => {
    setIsNoteDeleting(true);
    const toastId = toast.loading("Deleting note...");
    try {
      const res = await (
        await fetch(`/api/notes/${id}`, {
          method: "DELETE",
        })
      ).json();

      if (res.success) {
        toast.success("Note deleted successful", {
          id: toastId,
        });
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch {
      toast.error("Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsNoteDeleting(false);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addOrUpdateNote,
        isNoteAdding,
        isNoteUpdating,
        getNotes,
        isNotesLoading,
        isNoteDeleting,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

const useNotes = () => {
  const {
    notes,
    addOrUpdateNote,
    isNoteAdding,
    isNoteUpdating,
    getNotes,
    isNotesLoading,
    isNoteDeleting,
    deleteNote,
  } = useContext(NotesContext);

  return {
    notes,
    addOrUpdateNote,
    isNoteAdding,
    isNoteUpdating,
    getNotes,
    isNotesLoading,
    isNoteDeleting,
    deleteNote,
  };
};

export { NotesContext, NotesProvider, useNotes };
