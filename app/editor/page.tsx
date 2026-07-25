import { EditorPanel } from "@/components/editor/EditorPanel";

export default function EditorPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Humanize Writing Assistant
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Convert AI-generated content to natural, conversational human text instantly.
        </p>
      </div>
      <EditorPanel />
    </div>
  );
}
