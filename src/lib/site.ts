const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim();

export const SITE_URL = (configuredSiteUrl || "https://kiriteswarishaktipeeth.com").replace(/\/+$/, "");
export const SITE_NAME = "Kiriteswari Shaktipeeth";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/temple-social-card.jpg`;
