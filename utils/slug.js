// "Bridal Potli Bag (Red)" -> "bridal-potli-bag-red"
const slugify = (text = "") =>
  String(text)
    .normalize("NFKD")
    .replace(/\p{M}/gu, "") // accents: "Café" -> "Cafe"
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

const isObjectId = (value) => /^[a-f0-9]{24}$/i.test(String(value || ""));

// A slug free to use on Model: base, base-2, base-3 ... (never one that looks like an id)
const uniqueSlug = async (Model, text, excludeId = null) => {
  const base = slugify(text) || "item";
  let candidate = isObjectId(base) ? `${base}-1` : base;
  for (let n = 2; ; n++) {
    const filter = { $or: [{ slug: candidate }, { slugHistory: candidate }] };
    if (excludeId) filter._id = { $ne: excludeId };
    const taken = await Model.exists(filter);
    if (!taken) return candidate;
    candidate = `${base}-${n}`;
  }
};

// Finds a document by its id, its current slug, or a slug it used before
// (so old shared links keep working). Returns { doc, matchedOldSlug }.
const findByKey = async (Model, key, populate) => {
  const run = (q) => (populate ? q.populate(populate) : q);
  if (isObjectId(key)) {
    const doc = await run(Model.findById(key));
    if (doc) return doc;
  }
  const slug = String(key || "").toLowerCase();
  if (!slug) return null;
  return (
    (await run(Model.findOne({ slug }))) ||
    (await run(Model.findOne({ slugHistory: slug })))
  );
};

// Gives a slug to every document that doesn't have one yet (records made before slugs existed)
const backfillSlugs = async (Model, label, field = "name") => {
  const missing = await Model.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }] })
    .select(field)
    .lean();
  for (const doc of missing) {
    const slug = await uniqueSlug(Model, doc[field], doc._id);
    await Model.updateOne({ _id: doc._id }, { $set: { slug } }, { timestamps: false });
  }
  if (missing.length) console.log(`ℹ️ Added URL slugs to ${missing.length} ${label}`);
};

// Sets doc.slug to `wanted` (or one made from `fallbackText`), keeping the old slug in
// slugHistory so links to it still work. Call before doc.save().
const applySlug = async (Model, doc, wanted, fallbackText) => {
  const next = await uniqueSlug(Model, wanted || fallbackText, doc._id);
  doc.slugHistory = doc.slugHistory || [];
  if (doc.slug && doc.slug !== next && !doc.slugHistory.includes(doc.slug)) doc.slugHistory.push(doc.slug);
  doc.slugHistory = doc.slugHistory.filter((s) => s !== next);
  doc.slug = next;
};

module.exports = { slugify, uniqueSlug, findByKey, backfillSlugs, isObjectId, applySlug };
