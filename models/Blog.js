const mongoose = require("mongoose");
const slugify = require("slugify");

//Meta title and meta description
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    mainImage: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    authorProfileImage: { type: String },
    category: { type: String, required: true },
    slug: { type: String, unique: true }, // 👈 SEO slug
  },
  { timestamps: true }
);

// ✅ Auto-generate unique slug before saving
blogSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Check for existing slugs and append "-1", "-2", etc.
    while (await mongoose.models.Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
