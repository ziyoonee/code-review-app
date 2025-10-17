"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createHighlighter, Highlighter } from "shiki";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CodeInputEditor } from "@/components/editor/CodeInputEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Code2,
  FileText,
  Bug,
  RefreshCw,
  TestTube,
  Sparkles,
} from "lucide-react";
import { useReviewStore } from "@/lib/store/reviewStore";
import { generateMockReview } from "@/lib/utils/mockData";
import type { ReviewStyle } from "@/types/review.types";

const reviewSchema = z.object({
  code: z.string().min(10, "Code must be at least 10 characters"),
  style: z.enum(["detail", "bug", "refactor", "test"]),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const STYLE_OPTIONS: {
  value: ReviewStyle;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: "detail",
    label: "Detailed Review",
    icon: <Sparkles className="h-4 w-4" />,
    description: "Comprehensive analysis with all suggestions",
  },
  {
    value: "bug",
    label: "Bug Hunt",
    icon: <Bug className="h-4 w-4" />,
    description: "Focus on potential bugs and errors",
  },
  {
    value: "refactor",
    label: "Refactoring",
    icon: <RefreshCw className="h-4 w-4" />,
    description: "Improve code structure and readability",
  },
  {
    value: "test",
    label: "Test Coverage",
    icon: <TestTube className="h-4 w-4" />,
    description: "Suggest tests and improve coverage",
  },
];

export default function ReviewStartForm() {
  const router = useRouter();
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string>("plaintext");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setReview = useReviewStore((state) => state.setReview);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      code: "",
      style: "detail",
    },
  });

  const codeValue = watch("code");
  const styleValue = watch("style");

  // Initialize syntax highlighter
  useEffect(() => {
    createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [
        "javascript",
        "typescript",
        "python",
        "java",
        "go",
        "rust",
        "cpp",
      ],
    }).then(setHighlighter);
  }, []);

  // Detect language from code
  useEffect(() => {
    if (!codeValue || codeValue.length < 20) return;

    // Simple language detection based on patterns
    if (/\b(function|const|let|var|=>)\b/.test(codeValue)) {
      setDetectedLanguage("javascript");
    } else if (/\b(interface|type|namespace|enum)\b/.test(codeValue)) {
      setDetectedLanguage("typescript");
    } else if (/\b(def|import|from|class|if __name__)\b/.test(codeValue)) {
      setDetectedLanguage("python");
    } else if (/\b(public|private|class|void|int|String)\b/.test(codeValue)) {
      setDetectedLanguage("java");
    } else if (/\b(func|package|import|var|const)\b/.test(codeValue)) {
      setDetectedLanguage("go");
    } else {
      setDetectedLanguage("plaintext");
    }
  }, [codeValue]);

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);

    // Generate mock review
    const mockReview = generateMockReview({
      style: data.style,
      status: "processing",
    });

    // Store review in global state
    setReview(mockReview);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Navigate to review page
    router.push(`/reviews/${mockReview.id}`);
  };

  const handlePasteExample = () => {
    const exampleCode = `function processUserData(users) {
  let tempData = [];
  const config = { maxUsers: 100 };
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const result = await fetchUserDetails(user.id);
    
    if (result.status === 'active') {
      user.lastLogin = Date.now();
    }
  }
  
  return users;
}`;
    setValue("code", exampleCode);
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-50 animate-pulse" />
            <Code2 className="h-12 w-12 text-primary relative z-10" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-shine bg-[length:200%_auto]">
          AI Code Review
        </h1>
        <p className="text-muted-foreground text-lg">
          Get intelligent suggestions to improve your code quality
        </p>
      </div>

      <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-2 bg-gradient-to-br from-card via-card to-accent/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Start Your Code Review</CardTitle>
          <CardDescription>
            Paste your code below and select a review style
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Code Input Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Code to Review</label>
                <div className="flex items-center gap-2">
                  {detectedLanguage !== "plaintext" && (
                    <Badge variant="secondary">{detectedLanguage}</Badge>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handlePasteExample}
                    className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Paste Example
                  </Button>
                </div>
              </div>

              <div className="relative">
                <CodeInputEditor
                  value={codeValue}
                  onChange={(value) => setValue("code", value || "")}
                  language={detectedLanguage}
                  placeholder="// Paste your code here..."
                />
                {errors.code && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Review Style</label>
              <Tabs
                value={styleValue}
                onValueChange={(value) =>
                  setValue("style", value as ReviewStyle)
                }
              >
                <TabsList className="grid w-full grid-cols-4 h-auto">
                  {STYLE_OPTIONS.map((option) => (
                    <TabsTrigger
                      key={option.value}
                      value={option.value}
                      className="flex flex-col gap-1 p-3"
                    >
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {option.description}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || !codeValue}
                className="min-w-[200px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold transform hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Starting Review...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                    Start Review
                  </>
                )}
              </Button>
            </div>

            {/* Keyboard Shortcut Hint */}
            <div className="text-center text-sm text-muted-foreground">
              Press{" "}
              <kbd className="px-2 py-1 text-xs bg-muted rounded">Ctrl</kbd> +{" "}
              <kbd className="px-2 py-1 text-xs bg-muted rounded">Enter</kbd> to
              start review
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
