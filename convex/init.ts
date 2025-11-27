import { internalMutation } from "./_generated/server";

const publicationsData = [
    {
        title: 'LSF Annual Report 2023: Advancing Justice Through Legal Empowerment',
        description: 'Our comprehensive annual report showcasing the impact of legal aid services across Tanzania in 2023.',
        publishedDate: '2024-01-15',
        category: 'report',
        type: 'report',
        coverImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        pdfUrl: '/downloads/lsf-annual-report-2023.pdf',
        featured: true,
    },
    {
        title: 'Policy Brief: Strengthening Gender Justice Mechanisms in Tanzania',
        description: 'Analysis and recommendations for improving gender justice systems and women\'s access to legal services.',
        publishedDate: '2023-11-20',
        category: 'policy-brief',
        type: 'policy-brief',
        coverImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        pdfUrl: '/downloads/gender-justice-policy-brief.pdf',
        featured: true,
    },
    {
        title: 'Community Paralegal Training Guide: Building Legal Capacity at Grassroots',
        description: 'Comprehensive training manual for community paralegals working in rural and urban communities.',
        publishedDate: '2023-09-10',
        category: 'guide',
        type: 'guide',
        coverImageUrl: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        pdfUrl: '/downloads/paralegal-training-guide.pdf',
        featured: false,
    }
];

const newsData = [
    {
        title: "Mama Samia Legal Aid Campaign Reaches 15,000+ Citizens",
        excerpt: "The nationwide campaign provided free legal services to vulnerable communities across Tanzania, focusing on women's rights, land disputes, and family law matters.",
        content: "<p>The nationwide campaign provided free legal services to vulnerable communities across Tanzania, focusing on women's rights, land disputes, and family law matters.</p>", // Mock content
        date: "2024-04-30",
        image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        category: "Legal Empowerment",
        featured: true,
        seoTitle: "Mama Samia Legal Aid Campaign - 15,000+ Citizens Served",
        seoDescription: "LSF's nationwide legal aid campaign reaches over 15,000 vulnerable community members.",
        keywords: ['legal aid', 'campaign', 'Tanzania', 'women rights', 'community service']
    },
    {
        title: "Haki Yangu Mobile App Expands Access to Legal Services",
        excerpt: "LSF's digital transformation initiative has successfully connected over 5,000 users with legal resources and support through the new Haki Yangu mobile application.",
        content: "<p>LSF's digital transformation initiative has successfully connected over 5,000 users with legal resources and support through the new Haki Yangu mobile application.</p>",
        date: "2024-03-15",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        category: "Digital Transformation",
        featured: true,
        seoTitle: "Haki Yangu App Launch - Digital Legal Services Tanzania",
        seoDescription: "New mobile app connects 5,000+ users with legal resources and support services.",
        keywords: ['mobile app', 'digital services', 'legal technology', 'innovation']
    },
    {
        title: "New Climate Justice Initiative Tackles Environmental Legal Challenges",
        excerpt: "LSF launches a groundbreaking program to address climate-related legal issues affecting communities across Tanzania.",
        content: "<p>LSF launches a groundbreaking program to address climate-related legal issues affecting communities across Tanzania.</p>",
        date: "2024-02-22",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        category: "Climate Justice",
        featured: false,
        seoTitle: "Climate Justice Initiative - Environmental Legal Support",
        seoDescription: "New program addresses climate-related legal challenges in Tanzanian communities.",
        keywords: ['climate justice', 'environmental law', 'sustainability', 'legal support']
    }
];

export default internalMutation({
    args: {},
    handler: async (ctx) => {
        // Seed Publications
        for (const pub of publicationsData) {
            await ctx.db.insert("publications", pub);
        }

        // Seed News
        for (const news of newsData) {
            await ctx.db.insert("news", news);
        }

        console.log("Seeding complete!");
    },
});
