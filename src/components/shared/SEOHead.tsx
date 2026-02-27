import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article';
    canonicalUrl?: string;
    keywords?: string;
}

const SEOHead = ({
    title = 'LSF - Legal Services Facility Tanzania',
    description = 'Legal Services Facility (LSF) is a non-profit organization striving to increase access to justice for all in Tanzania and Zanzibar.',
    image = '/lsf-og-image.png',
    type = 'website',
    canonicalUrl,
    keywords = 'Legal Services Facility, LSF Tanzania, Access to Justice, Legal Aid, Human Rights, Tanzania, Zanzibar',
}: SEOHeadProps) => {
    const siteTitle = title === 'LSF - Legal Services Facility Tanzania' ? title : `${title} | LSF Tanzania`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Legal Services Facility (LSF)" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Canonicals */}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        </Helmet>
    );
};

export default SEOHead;
