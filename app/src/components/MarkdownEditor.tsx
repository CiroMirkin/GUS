import { useRef } from 'react'
import {
  MDXEditor,
  type MDXEditorMethods,
  toolbarPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  markdownShortcutPlugin,
  UndoRedo,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  ListsToggle,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  Separator,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

type MarkdownEditorProps = {
  value?: string
  onChange?: (markdown: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export function MarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Escribe algo ...',
  autoFocus = true,
  className,
}: MarkdownEditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null)

  return (
    <div
      className="w-full p-4 shadow-lg overflow-y-auto"
      style={{ height: 'calc(100vh - 220px)' }}
    >
      <MDXEditor
        ref={editorRef}
        markdown={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={className}
        contentEditableClassName="min-h-full pb-[150px]"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              txt: 'Texto',
              js: 'JavaScript',
              ts: 'TypeScript',
              css: 'CSS',
              html: 'HTML',
              json: 'JSON',
            },
          }),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <ListsToggle />
                <Separator />
                <CreateLink />
                <InsertTable />
                <InsertThematicBreak />
                <InsertCodeBlock />
              </>
            ),
          }),
        ]}
      />
    </div>
  )
}
