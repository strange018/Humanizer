"use client";

import { useEffect, useState } from "react";
import { REWRITE_MODES, type RewriteMode } from "@/lib/openai";
import { formatDate, downloadTextFile } from "@/lib/utils";
import {
  Search,
  Filter,
  Trash2,
  Copy,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  Sparkles,
  Columns,
  X,
  Check,
} from "lucide-react";

export function HistoryList() {
  const [rewrites, setRewrites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Preview Modal
  const [selectedRewrite, setSelectedRewrite] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "8",
        search,
        mode,
      });
      const res = await fetch(`/api/history?${query}`);
      const data = await res.json();
      if (res.ok) {
        setRewrites(data.rewrites);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [search, mode, page]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this rewrite from your history?")) return;

    try {
      const res = await fetch(`/api/history?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchHistory();
        if (selectedRewrite?.id === id) {
          setSelectedRewrite(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (text: string, modeType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadTextFile(text, `humanized-${modeType}.txt`);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search past rewrites..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-colors outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-40 px-3 py-2 bg-card border border-border rounded-xl text-xs font-semibold focus:border-primary outline-none cursor-pointer"
          >
            <option value="">All Styles</option>
            {Object.entries(REWRITE_MODES).map(([key, value]) => (
              <option key={key} value={key}>
                {value.emoji} {value.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Rewrite Cards */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading history...</p>
        </div>
      ) : rewrites.length === 0 ? (
        <div className="border border-dashed rounded-2xl p-12 text-center text-muted-foreground">
          <p className="text-sm font-semibold">No history items found.</p>
          <p className="text-xs opacity-75 mt-1">Try resetting your search or mode filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewrites.map((rewrite) => {
            const modeDetail = REWRITE_MODES[rewrite.mode as RewriteMode] || {
              label: rewrite.mode,
              emoji: "✍️",
            };
            return (
              <div
                key={rewrite.id}
                onClick={() => setSelectedRewrite(rewrite)}
                className="border border-border/80 bg-card hover:border-muted-foreground/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-[180px] group relative"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-sm text-foreground truncate pr-6">
                      {rewrite.title || "Untitled Rewrite"}
                    </h3>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide shrink-0">
                      {modeDetail.emoji} {modeDetail.label}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                    {rewrite.rewrittenText}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                    <Calendar className="h-3 w-3" />
                    {formatDate(rewrite.createdAt)}
                  </span>

                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCopy(rewrite.rewrittenText, rewrite.id, e)}
                      className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      title="Copy"
                    >
                      {copiedId === rewrite.id ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDownload(rewrite.rewrittenText, rewrite.mode, e)}
                      className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      title="Download"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(rewrite.id, e)}
                      className="p-1.5 rounded-lg border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-lg border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-lg border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedRewrite && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-card border border-border w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b px-5 py-4 bg-muted/40">
              <div className="min-w-0">
                <h3 className="font-bold text-base text-foreground truncate">
                  {selectedRewrite.title || "Untitled Rewrite"}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Style: {selectedRewrite.mode.toUpperCase()} | Word Count: {selectedRewrite.wordCount}
                </p>
              </div>
              <button
                onClick={() => setSelectedRewrite(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Original
                </span>
                <div className="p-4 rounded-xl border bg-muted/20 text-sm text-muted-foreground max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                  {selectedRewrite.originalText}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Humanized
                </span>
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-sm text-foreground max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                  {selectedRewrite.rewrittenText}
                </div>
              </div>
            </div>

            <div className="border-t px-6 py-4 bg-muted/20 flex justify-end gap-3">
              <button
                onClick={(e) => handleCopy(selectedRewrite.rewrittenText, selectedRewrite.id, e)}
                className="px-4 py-2 border hover:bg-muted rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === selectedRewrite.id ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy Humanized
                  </>
                )}
              </button>
              <button
                onClick={(e) =>
                  handleDownload(selectedRewrite.rewrittenText, selectedRewrite.mode, e)
                }
                className="px-4 py-2 border hover:bg-muted rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-4 w-4" /> Download TXT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
