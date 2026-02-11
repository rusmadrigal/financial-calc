/** GROQ: calculator page by slug with category. */
export const calculatorPageBySlugQuery = `*[_type == "calculatorPage" && slug.current == $slug][0]{
  title,
  slug,
  calculatorType,
  shortDescription,
  metaTitle,
  metaDescription,
  noindex,
  content,
  faqs,
  category->{
    title,
    slug,
    icon,
    order,
    hidden
  }
}`;
