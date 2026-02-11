import { defineField, defineType } from "sanity";

export const toolCategory = defineType({
  name: "toolCategory",
  title: "Tool Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
    defineField({
      name: "hidden",
      title: "Hidden",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
