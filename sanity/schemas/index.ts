// Sanity schema definitions for Blizz Markets CMS

export const post = {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'author', title: 'Author', type: 'reference', to: [{ type: 'author' }] },
    { name: 'mainImage', title: 'Main Image', type: 'image', options: { hotspot: true } },
    { name: 'categories', title: 'Categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
    { name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 },
        { name: 'ogImage', title: 'OG Image', type: 'image' },
      ],
    },
  ],
}

export const author = {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'image', title: 'Image', type: 'image' },
  ],
}

export const category = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
  ],
}

export const announcement = {
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
    { name: 'type', title: 'Type', type: 'string', options: { list: ['info', 'warning', 'success', 'critical'] } },
  ],
}

export const faq = {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'answer', title: 'Answer', type: 'text', validation: (Rule: any) => Rule.required() },
    { name: 'category', title: 'Category', type: 'string', options: { list: ['general', 'trading', 'tokens', 'compliance', 'technical'] } },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
}

export const pageContent = {
  name: 'pageContent',
  title: 'Page Content',
  type: 'document',
  fields: [
    { name: 'page', title: 'Page', type: 'string', options: { list: ['home', 'about', 'markets', 'sports', 'launchpad'] } },
    { name: 'heroTitle', title: 'Hero Title', type: 'string' },
    { name: 'heroSubtitle', title: 'Hero Subtitle', type: 'text', rows: 2 },
    { name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
  ],
}

export const schemaTypes = [post, author, category, announcement, faq, pageContent]
