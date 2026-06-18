import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogPostLayout } from "@/components/BlogPostLayout";
import { notFound } from "next/navigation";

const post = getBlogPost("como-elegir-techo-sol-y-sombra")!;

if (!post) notFound();

export const metadata: Metadata = {
  title: post.seo.title,
  description: post.seo.description,
  keywords: post.seo.keywords,
};

export default function ComoElegirTechoPage() {
  return <BlogPostLayout post={post} />;
}
