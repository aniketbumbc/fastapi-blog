import { SlugReader } from "@/components/slugreader/SlugReader";

// Option A: posts live in the browser, so reading happens client-side.
// (When the backend lands, this becomes a server component that fetches by
// slug and renders <BookPost post={post} /> directly.)
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#6b6f63] p-6 md:p-10">
      <SlugReader slug={slug} />
    </main>
  );
}