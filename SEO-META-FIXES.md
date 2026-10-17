# SEO metadata fixes for RastaYaar

This update addresses the homepage warnings shown by Meta SEO Inspector:

- Adds an absolute canonical URL for the homepage: `https://www.rastayaar.com/`.
- Adds Open Graph `og:url`, `og:image`, and image alt metadata.
- Expands the homepage H1 to a descriptive, readable heading while retaining the RastaYaar brand.
- Adds a robots directive and a modest keyword meta tag (the keyword tag is informational and is not a Google ranking factor).
- Adds descriptive `title` attributes to the homepage hero/fleet images and site logo, explicit image dimensions, and loading attributes.
- Adds `public/rastayaar-social.png` as the stable social-preview image URL.

## Deployment checks

1. Deploy these files to the same canonical host, `https://www.rastayaar.com/`. If the preferred production host changes, update canonical and Open Graph URLs in `src/routes/index.tsx`.
2. Confirm `https://www.rastayaar.com/rastayaar-social.png` loads publicly after deployment.
3. Re-run Meta SEO Inspector against the live homepage, not a local preview. Cached HTML can make fixes appear absent until refreshed.
4. Canonical URLs should be configured for every indexable route, not copied from the homepage. This update targets the homepage warnings in the supplied report; route-specific canonicals for all dynamic pages should be generated from their actual URLs as a separate site-wide pass.
5. SEO tools may still show informational tips (for example image loading attributes) rather than errors. Meta keywords are not used by Google Search for ranking. SEO metadata cannot guarantee rankings or AdSense approval.
