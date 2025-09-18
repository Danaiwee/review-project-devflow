"use client";

import {
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  Separator,
  tablePlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import "./dark-editor.css";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";
import { Ref } from "react";

interface EditorProps {
  value: string;
  editorRef: Ref<MDXEditorMethods> | null;
  fieldChange: (value: string) => void;
}

const Editor = ({ value, editorRef, fieldChange }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const themeExtension = resolvedTheme === "dark" ? [basicDark] : [];

  return (
    <MDXEditor
      ref={editorRef}
      markdown={value}
      onChange={fieldChange}
      className="background-light800_dark200 light-border-2 markdown-editor dark-editor grid w-full border rounded-md"
      plugins={[
        headingsPlugin(), //supports # H1, ## H2, etc.
        listsPlugin(), //supports bulleted/numbered lists.
        linkPlugin(), //add links.
        linkDialogPlugin(), //add links.
        quotePlugin(), //blockquotes.
        markdownShortcutPlugin(), //keyboard shortcuts like Cmd+B.
        tablePlugin(), //insert tables.
        imagePlugin(), //insert images.
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }), //adds support for fenced code blocks in Markdown.
        //uses CodeMirror editor inside the code blocks.
        codeMirrorPlugin({
          //maps language identifiers for syntax highlighting.
          codeBlockLanguages: {
            css: "css",
            txt: "txt",
            sql: "sql",
            html: "html",
            sass: "sass",
            scss: "scss",
            bash: "bash",
            json: "json",
            js: "javascript",
            ts: "typescript",
            "": "unspecified",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
          },
          autoLoadLanguageSupport: true, //dynamically loads language syntax support.
          codeMirrorExtensions: themeExtension, //adds the dark theme extension conditionally.
        }),
        //Adds diff view support to compare changes in markdown.
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),

        //renders a toolbar.
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />, //select bar to change the language
                },
                {
                  fallback: () => (
                    <div className="flex flex-wrap">
                      <>
                        <UndoRedo />
                        <Separator />

                        <BoldItalicUnderlineToggles />
                        <CodeToggle />
                        <Separator />

                        <ListsToggle />
                        <Separator />

                        <CreateLink />
                        <InsertImage />
                        <Separator />

                        <InsertTable />
                        <InsertThematicBreak />
                        <Separator />

                        <InsertCodeBlock />
                      </>
                    </div>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
    />
  );
};

export default Editor;
