import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogPostLayout } from "@/components/BlogPostLayout";
import { notFound } from "next/navigation";

const post = getBlogPost("ideas-para-terrazas-modernas")!;

if (!post) notFound();

export const metadata: Metadata = {
  title: post.seo.title,
  description: post.seo.description,
  keywords: post.seo.keywords,
};

export default function IdeasTerrazasPage() {
  return <BlogPostLayout post={post} />;
}
