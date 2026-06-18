import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogPostLayout } from "@/components/BlogPostLayout";
import { notFound } from "next/navigation";

const post = getBlogPost("como-empezar-con-domotica")!;

if (!post) notFound();

export const metadata: Metadata = {
  title: post.seo.title,
  description: post.seo.description,
  keywords: post.seo.keywords,
};

export default function ComoEmpezarDomoticaPage() {
  return <BlogPostLayout post={post} />;
}
