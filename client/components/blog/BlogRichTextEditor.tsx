import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link2,
  Heading2,
  Quote,
  Undo2,
  Redo2,
  RemoveFormatting,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { plainTextToBlogHtml } from "@/lib/blogHtml";

type BlogRichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeightClass?: string;
};

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center h-8 w-8 rounded-sm text-cu-black",
        active ? "bg-cu-orange/15 text-cu-orange" : "hover:bg-cu-warm-white",
      )}
    >
      {children}
    </button>
  );
}

export function BlogRichTextEditor({
  value,
  onChange,
  placeholder = "Escribe aquí… Selecciona texto para formatear.",
  className,
  minHeightClass = "min-h-[9rem]",
}: BlogRichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-cu-orange underline underline-offset-2",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value?.trim() ? plainTextToBlogHtml(value) : "",
    editorProps: {
      attributes: {
        class: cn(
          "prose-cu max-w-none focus:outline-none px-3 py-2 text-sm font-josefin text-cu-black leading-relaxed",
          minHeightClass,
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Sync external value (e.g. test data fill) without fighting typing
  useEffect(() => {
    if (!editor) return;
    const incoming = value?.trim() ? plainTextToBlogHtml(value) : "";
    const current = editor.getHTML();
    if (incoming === current || (incoming === "" && current === "<p></p>")) return;
    editor.commands.setContent(incoming || "", { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL del enlace", prev || "https://");
    if (url === null) return;
    const trimmed = url.trim();
    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  };

  const tools = (
    <>
      <ToolbarButton
        label="Negrita"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Cursiva"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Subrayado"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Encabezado"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Lista"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Lista numerada"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Cita"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={15} />
      </ToolbarButton>
      <ToolbarButton label="Enlace" active={editor.isActive("link")} onClick={setLink}>
        <Link2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Quitar formato"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        <RemoveFormatting size={15} />
      </ToolbarButton>
      <span className="w-px h-5 bg-cu-stone/30 mx-0.5" aria-hidden />
      <ToolbarButton label="Deshacer" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 size={15} />
      </ToolbarButton>
      <ToolbarButton label="Rehacer" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 size={15} />
      </ToolbarButton>
    </>
  );

  return (
    <div
      className={cn(
        "rounded-sm border border-cu-stone/40 bg-white overflow-hidden focus-within:border-cu-orange focus-within:ring-1 focus-within:ring-cu-orange/30",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 px-1.5 py-1.5 border-b border-cu-stone/20 bg-cu-warm-white/60">
        {tools}
      </div>

      {editor && (
        <BubbleMenu
          editor={editor}
          className="flex items-center gap-0.5 rounded-sm border border-cu-stone/30 bg-white shadow-md px-1 py-1 z-50"
        >
          {tools}
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
      <p className="px-3 pb-2 text-[11px] text-cu-concrete font-josefin">
        Selecciona texto para ver el menú flotante, o usa la barra superior (negrita, listas,
        enlaces…).
      </p>
    </div>
  );
}
