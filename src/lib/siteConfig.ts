import siteContactData from "@/lib/content/data/siteContact.json"

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

export const siteContact: SiteContactConfig = siteContactData
