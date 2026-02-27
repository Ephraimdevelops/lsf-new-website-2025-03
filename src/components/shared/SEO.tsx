import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    keywords?: string;
    author?: string;
}

const SEO = ({
    title = 'LSF - Legal Services Facility Tanzania',
    description = 'Legal Services Facility (LSF) is a basket fund established in 2011 as a non-profit organization that strives to increase access to justice for all working in Tanzania and Zanzibar.',
    image = 'https://lsftz.org/lsf-og-image.png', // Replace with production URL when live
    url = 'https://lsftz.org',
    type = 'website',
    keywords = 'Legal Services Facility, LSF Tanzania, Access to Justice, Legal Aid Tanzania, Human Rights Tanzania, Zanzibar Legal Services',
    author = 'LSF Tanzania',
}: SEOProps) => {
    const fullTitle = title === 'LSF - Legal Services Facility Tanzania' ? title : `${title} | LSF Tanzania`;

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Canonical Link */}
            <link rel="canonical" href={url} />
        </Helmet>
    );
};

export default SEO;
