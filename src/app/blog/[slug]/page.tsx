import { client } from '@/sanity/lib/client'
import { BLOG_POST_QUERY } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!client) return { title: 'Blog Post' }
  const { slug } = await params

  try {
    const post = await client.fetch(BLOG_POST_QUERY, { slug })
    if (!post) return { title: 'Post Not Found' }
    return {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
    }
  } catch {
    return { title: 'Blog Post' }
  }
}

export default async function BlogPostPage({ params }: Props) {
  if (!client) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-rekt-muted">Blog not configured yet.</p>
        <Link href="/blog" className="text-rekt-blue hover:underline mt-4 inline-block">Back to Blog</Link>
      </div>
    )
  }

  const { slug } = await params
  let post: any = null

  try {
    post = await client.fetch(BLOG_POST_QUERY, { slug })
  } catch {
    notFound()
  }

  if (!post) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog" className="text-sm text-rekt-blue hover:underline mb-6 inline-block">
        ← Back to Blog
      </Link>

      <div className="flex items-center gap-2 text-xs text-rekt-muted mb-4">
        {post.publishedAt && (
          <time>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
        )}
        {post.author && <span>· {post.author}</span>}
      </div>

      <h1 className="font-display text-3xl font-bold text-white mb-6">{post.title}</h1>

      {post.body && (
        <div className="prose prose-invert prose-sm max-w-none space-y-4">
          <PortableText
            value={post.body}
            components={{
              block: {
                h1: ({ children }) => <h2 className="text-2xl font-bold text-white mt-8 mb-3">{children}</h2>,
                h2: ({ children }) => <h3 className="text-xl font-bold text-white mt-6 mb-2">{children}</h3>,
                h3: ({ children }) => <h4 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h4>,
                normal: ({ children }) => <p className="text-rekt-muted leading-relaxed">{children}</p>,
                blockquote: ({ children }) => <blockquote className="border-l-2 border-rekt-blue pl-4 italic text-rekt-muted">{children}</blockquote>,
              },
              list: {
                bullet: ({ children }) => <ul className="list-disc pl-5 space-y-1 text-rekt-muted">{children}</ul>,
                number: ({ children }) => <ol className="list-decimal pl-5 space-y-1 text-rekt-muted">{children}</ol>,
              },
              marks: {
                strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                em: ({ children }) => <em>{children}</em>,
                link: ({ value, children }) => (
                  <a href={value?.href} className="text-rekt-blue hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              },
            }}
          />
        </div>
      )}
    </div>
  )
}
