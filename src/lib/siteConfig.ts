export type SocialKey =
  | "facebook"
  | "instagram"
  | "x"
  | "youtube"
  | "tiktok"
  | "linkedin"

export type SiteContactConfig = {
  email?: string
  whatsapp?: string
  socials: Partial<Record<SocialKey, string>>
}

/**
 * NOTE:
 * We no longer import siteContact.json here.
 * Source of truth is PageCMS file: content/data/siteContact.json
 * Read it via getSiteContact() from src/lib/content/data.ts inside getStaticProps.
 */
export const siteContact: SiteContactConfig = {
  email: "",
  whatsapp: "",
  socials: {},
}
