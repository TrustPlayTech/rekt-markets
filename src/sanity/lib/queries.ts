export const BLOG_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  "author": author->name,
  categories[]->{ title, slug }
}`

export const BLOG_POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  body,
  excerpt,
  publishedAt,
  mainImage,
  "author": author->name,
  seo {
    metaTitle,
    metaDescription,
    ogImage
  }
}`
