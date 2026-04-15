import { client } from '@/sanity/lib/client'
import { BLOG_POSTS_QUERY } from '@/sanity/lib/queries'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, updates, and insights from Rekt Markets.',
}

export const revalidate = 60

interface Post {
  _id: string
  title: string
  slug: { current: string } | null
  excerpt: string
  publishedAt: string
  author: string
  categories: { title: string; slug: { current: string } | null }[] | null
}

export default async function BlogPage() {
  let posts: Post[] = []

  if (client) {
    try {
      posts = await client.fetch(BLOG_POSTS_QUERY)
    } catch {
      // Sanity fetch failed
    }
  }

  const validPosts = posts.filter(p => p?.slug?.current)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Blog</h1>
        <p className="text-rekt-muted">News, updates, and insights from Rekt Markets</p>
      </div>

      {validPosts.length === 0 ? (
        <div className="rounded-2xl border border-rekt-border bg-rekt-card p-12 text-center">
          <p className="text-rekt-muted mb-2">No posts yet.</p>
          <p className="text-xs text-rekt-muted/60">Content coming soon.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {validPosts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug!.current}`}
              className="block rounded-xl border border-rekt-border bg-rekt-card p-6 hover:border-rekt-blue/30 transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-rekt-muted mb-2">
                {post.publishedAt && (
                  <time>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                )}
                {post.author && <span>· {post.author}</span>}
              </div>
              <h2 className="text-lg font-bold text-white mb-2">{post.title}</h2>
              {post.excerpt && <p className="text-sm text-rekt-muted line-clamp-2">{post.excerpt}</p>}
              {post.categories && post.categories.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {post.categories.filter(c => c?.title).map((cat, i) => (
                    <span key={i} className="rounded-full bg-rekt-blue/10 px-2 py-0.5 text-[10px] text-rekt-blue">
                      {cat.title}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
