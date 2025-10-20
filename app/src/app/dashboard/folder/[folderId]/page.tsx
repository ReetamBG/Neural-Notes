"use client";
import {
  analyzeNote,
  getVectorDbStatus,
  NoteAnalysisResult,
} from "@/actions/ai.actions";
import { getCurrentDBUser } from "@/actions/user.actions";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Note } from "@/generated/prisma/wasm";
import { useIsMobile } from "@/hooks/use-mobile";
import useNotesStore from "@/store/notes.store";
import { useUser } from "@clerk/nextjs";
import {
  ClipboardCheck,
  Edit,
  FilePlus2,
  LoaderCircle,
  Trash2,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const {
    currentFolder,
    fetchAllNotesInFolder,
    notesInCurrentFolder,
    isNotesLoading,
  } = useNotesStore();

  useEffect(() => {
    if (!currentFolder?.id) return;

    fetchAllNotesInFolder(currentFolder.id);
  }, [currentFolder?.id, fetchAllNotesInFolder]);

  return (
    <div className="relative w-full h-[calc(100vh-3rem)]">
      {/* Background ripple effect positioned behind content */}
      <BackgroundRippleEffect
        cellSize={70}
        className="absolute inset-0 w-full h-full
         dark:[--cell-border-color:var(--color-neutral-800)]!
         dark:[--cell-fill-color:var(--color-neutral-950)]!
         dark:[--cell-shadow-color:var(--color-neutral-900)]!"
      />

      {/* Main content with relative positioning to ensure it's above background */}
      <div className="relative z-10 p-4 overflow-y-auto h-full">
        <Link href={`/dashboard/folder/${currentFolder?.id}/new-note/editor`}>
          <Button className="bg-accent-foreground">
            New Note <FilePlus2 />
          </Button>
        </Link>
        {isNotesLoading ? (
          <div className="space-y-2 my-4">
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <Skeleton key={idx} className="h-24 w-full" />
              ))}
          </div>
        ) : (
          <>
            {notesInCurrentFolder.length === 0 ? (
              <Card className="my-4 py-2 bg-card/70 border-0 border-b-4">
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    No notes found in this folder.
                    <br />
                    <br /> Create a new note to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {notesInCurrentFolder.map((note) => {
                  return <NoteCard key={note.id} note={note} />;
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NoteCard = ({ note }: { note: Note }) => {
  const isMobile = useIsMobile();
  const { currentFolder, deleteNote } = useNotesStore();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Card key={note.id} className="my-4 py-2 bg-card/70 border-0 border-b-4">
      <CardHeader>
        <CardTitle className="text-accent-foreground text-lg sm:text-2xl">
          {note.title}
        </CardTitle>
        <CardDescription className="text-foreground text-base">
          {isMobile ? (
            <> {note.contentString?.slice(0, 20)}...</>
          ) : (
            <> {note.contentString?.slice(0, 100)}...</>
          )}
        </CardDescription>
        <CardAction className="flex gap-2 flex-col lg:flex-row">
          <Tooltip>
            <TooltipTrigger asChild>
              <AnalyzeNoteButton note={note} />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Analyze the <br />
                accuracy of <br /> your note
              </p>
            </TooltipContent>
          </Tooltip>
          <div className="flex gap-2 md:gap-4 items-center">
            <Link
              href={`/dashboard/folder/${currentFolder?.id}/note/${note.id}/editor`}
            >
              <Button className="flex h-8 gap-2 bg-accent-foreground">
                <Edit size={20} /> Edit
              </Button>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={async () => {
                    setIsDeleting(true);
                    await deleteNote(note.id);
                    setIsDeleting(false);
                  }}
                  className="gap-2 h-8 text-accent-foreground hover:text-foreground cursor-pointer"
                >
                  {isDeleting ? (
                    <Spinner className="size-5" />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete note</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardAction>
      </CardHeader>
      <CardFooter className="text-xs text-muted-foreground">
        <p>Last updated: {new Date(note.updatedAt).toLocaleString()}</p>
      </CardFooter>
    </Card>
  );
};

export default Page;

const AnalyzeNoteButton = ({ note }: { note: Note }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [noteAnalysisResult, setNoteAnalysisResult] =
    useState<NoteAnalysisResult | null>(null);
  const { currentFolder } = useNotesStore();
  const { isLoaded, user } = useUser();
  const [open, setOpen] = useState(false);

  if (!isLoaded || !user) {
    return null;
  }
  if (!currentFolder) {
    return null;
  }

  const handleAnalyzeNote = async () => {
    setIsAnalyzing(true);

    const user = await getCurrentDBUser();
    // check if resource is uploaded
    const vectorDbStatus = await getVectorDbStatus(user!.id, currentFolder.id);
    if (!vectorDbStatus) {
      toast.error("Please upload a reference material first");
      setIsAnalyzing(false);
      return;
    }

    const res = await analyzeNote(
      note.title,
      note.contentString!,
      user!.id,
      currentFolder.id
    );

    console.log(res);
    if (res) {
      console.log(noteAnalysisResult);
      setNoteAnalysisResult(res);
      toast.success("Note analyzed successfully.");
    } else {
      toast.error("Failed to analyze note.");
    }
    setIsAnalyzing(false);
  };

  const steps = [
    "Understanding your notes hmm...",
    "Consulting with AI tutor",
    "Comparing results",
    "Generating analysis",
    "Generating roadmap",
  ];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" className="h-8 rounded-lg flex gap-2">
          <ClipboardCheck />
          Analyze
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="text-lg sm:text-2xl text-accent-foreground">
            Analysis of note {note.title}
          </DrawerTitle>
          {!noteAnalysisResult && (
            <DrawerDescription>
              This process analyzes your notes based on the <br />
              uploaded reference material, so please <br />
              ensure that you have a resource uploaded first.
            </DrawerDescription>
          )}
        </DrawerHeader>
        <div className="overflow-y-auto flex-1">
          {isAnalyzing ? (
            <MultiStepLoader
              loading={isAnalyzing}
              loadingStates={steps.map((step) => ({ text: step }))}
            />
          ) : (
            <div className="px-6 pb-4">
              {noteAnalysisResult ? (
                <AnalysisReport analysis={noteAnalysisResult} />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>
                    Ready to analyze your notes? Click the button below to get
                    started!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <DrawerFooter>
          <div className="mt-8 flex gap-2 w-full justify-center">
            {isAnalyzing ? (
              <Button disabled onClick={() => handleAnalyzeNote}>
                <LoaderCircle className="animate-spin" />
                Analyzing...
              </Button>
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleAnalyzeNote();
                }}
              >
                {noteAnalysisResult ? "Reanalyze Note" : "Start analyzing"}
              </Button>
            )}
            <DrawerClose asChild>
              <Button onClick={() => setIsAnalyzing(false)} variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

// Tutor-like Analysis Display Component (Formatted by AI dont ask me)
const AnalysisReport = ({ analysis }: { analysis: NoteAnalysisResult }) => {
  const getAccuracyMessage = (accuracy: number) => {
    if (accuracy >= 90) {
      return {
        message:
          "Excellent work! 🎉 Your notes are comprehensive and accurate. You've mastered this topic!",
        color: "text-foreground",
        bgColor: "bg-muted/20 border-muted-foreground/20",
      };
    } else if (accuracy >= 70) {
      return {
        message:
          "Great job! 👍 Your notes are quite good, but there's always room for improvement.",
        color: "text-foreground",
        bgColor: "bg-muted/20 border-muted-foreground/20",
      };
    } else if (accuracy >= 50) {
      return {
        message:
          "Good start! 📚 You're on the right track, but let's strengthen your understanding.",
        color: "text-foreground",
        bgColor: "bg-muted/20 border-muted-foreground/20",
      };
    } else if (accuracy >= 30) {
      return {
        message:
          "Keep going! 💪 Your notes need some work. Don't worry, we'll help you improve!",
        color: "text-foreground",
        bgColor: "bg-muted/20 border-muted-foreground/20",
      };
    } else {
      return {
        message:
          "Oh dear! 😅 Your notes are quite incomplete. Time to hit the books harder! But don't worry, everyone starts somewhere.",
        color: "text-foreground",
        bgColor: "bg-muted/20 border-muted-foreground/20",
      };
    }
  };

  const accuracyInfo = getAccuracyMessage(analysis.accuracy);

  return (
    <div className="px-0 sm:px-15 md:px-30 space-y-4 w-full">
      {/* Accuracy Section */}
      <div className={`p-4 rounded-lg border ${accuracyInfo.bgColor}`}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-semibold text-foreground">
            Your Study Score: {Math.round(analysis.accuracy * 100) / 100}%
          </h3>
        </div>
        <p className={`text-sm ${accuracyInfo.color} mb-3`}>
          {accuracyInfo.message}
        </p>
        <Progress value={analysis.accuracy} className="h-2" />
      </div>

      {/* LLM Note Section */}
      {analysis.llm_note && (
        <div className="p-4 rounded-lg border bg-muted/10 border-muted-foreground/20">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">
              Your AI Tutor&apos;s Note
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {analysis.llm_note}
          </p>
        </div>
      )}

      {/* Missing Information Section */}
      {analysis.missing_info && analysis.missing_info.length > 0 && (
        <div className="p-4 rounded-lg border bg-muted/10 border-muted-foreground/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">
              Critical Information Missing
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Hey there! Your notes are missing some important concepts that are
            essential for understanding this topic:
          </p>
          <div className="space-y-2 mb-3">
            {analysis.missing_info.map((info, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5 text-xs">•</span>
                <span className="text-sm text-foreground">{info}</span>
              </div>
            ))}
          </div>
          <div className="p-3 bg-muted/20 rounded-md">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tutor&apos;s Tip:</strong> These missing pieces are
              like puzzle parts - without them, the full picture isn&apos;t
              clear. Try reviewing your source material for these topics!
            </p>
          </div>
        </div>
      )}

      {/* Missing Keywords Section */}
      {analysis.missing_keywords && analysis.missing_keywords.length > 0 && (
        <div className="p-4 rounded-lg border bg-muted/10 border-muted-foreground/20">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">
              Key Terms You Missed
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            These essential keywords are the building blocks of this topic.
            Including them will make your notes much stronger:
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {analysis.missing_keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
          <div className="p-3 bg-muted/20 rounded-md">
            <p className="text-xs text-muted-foreground">
              🎯 <strong>Study Strategy:</strong> Try using these keywords in
              your notes. They&apos;re like signposts that help navigate the
              topic!
            </p>
          </div>
        </div>
      )}

      {/* Roadmap Section */}
      {analysis.roadmap && analysis.roadmap.length > 0 && (
        <div className="p-4 rounded-lg border bg-muted/10 border-muted-foreground/20">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">
              Your Learning Roadmap
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Here&apos;s your personalized study path to master this topic.
            Follow these steps to improve your understanding:
          </p>
          <div className="space-y-3 mb-3">
            {analysis.roadmap.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 bg-muted text-muted-foreground rounded-full text-xs font-medium mt-0.5 flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-sm text-foreground leading-relaxed">
                  {step}
                </span>
              </div>
            ))}
          </div>
          <div className="p-3 bg-muted/20 rounded-md">
            <p className="text-xs text-muted-foreground">
              🌟 <strong>Motivational Note:</strong> Every expert was once a
              beginner. Take it one step at a time, and you&apos;ll get there!
            </p>
          </div>
        </div>
      )}

      {/* Encouragement Section */}
      <div className="p-4 rounded-lg border bg-muted/10 border-muted-foreground/20">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-semibold text-foreground">
            Keep Learning!
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Remember, learning is a journey, not a destination. Each analysis
          helps you grow stronger. Keep taking notes, keep asking questions, and
          keep pushing forward. You&apos;ve got this! 💪
        </p>
      </div>
    </div>
  );
};
