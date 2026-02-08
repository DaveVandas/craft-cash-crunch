import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://earningsexplorer.shop';

interface PageMetaProps {
  title: string;
  description: string;
  image?: string;
  path?: string;
}

const PageMeta = ({ title, description, image, path = '' }: PageMetaProps) => {
  const fullTitle = `${title} | Wealth Perspective`;
  const imageUrl = image ? `${SITE_URL}${image}` : `${SITE_URL}/og-image.png`;
  const pageUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default PageMeta;
