import { nanoid } from "nanoid";

export const generateUniqueSlug = (title = "") => {
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
  return `${slug}-${nanoid(6)}`;
};
