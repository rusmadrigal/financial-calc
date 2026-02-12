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
  howItWorks,
  sources,
  faqs[]{
    question,
    answer
  },
  category->{
    title,
    slug,
    icon,
    order,
    hidden
  }
}`;
