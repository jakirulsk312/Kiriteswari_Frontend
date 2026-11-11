import { Helmet } from "react-helmet-async";
import { DEFAULT_SOCIAL_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

type PageSeoProps = {
  title: string;
  description: string;
  path?: string;
};

const PageSeo = ({ title, description, path = "/" }: PageSeoProps) => {
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_SOCIAL_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_SOCIAL_IMAGE} />
    </Helmet>
  );
};

export default PageSeo;
