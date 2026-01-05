import { mutation } from "./_generated/server";

// Force clear all content and reseed with fresh data
export const clearAllAndReseed = mutation({
    args: {},
    handler: async (ctx) => {
        // Clear all existing stories
        const existingStories = await ctx.db.query("success_stories").collect();
        for (const story of existingStories) {
            await ctx.db.delete(story._id);
        }
        // Clear all existing team members
        const existingTeam = await ctx.db.query("team_members").collect();
        for (const member of existingTeam) {
            await ctx.db.delete(member._id);
        }
        // Clear all existing news
        const existingNews = await ctx.db.query("news").collect();
        for (const article of existingNews) {
            await ctx.db.delete(article._id);
        }
        // Clear all existing opportunities
        const existingOpportunities = await ctx.db.query("opportunities").collect();
        for (const opp of existingOpportunities) {
            await ctx.db.delete(opp._id);
        }
        // Clear all existing publications
        const existingPubs = await ctx.db.query("publications").collect();
        for (const pub of existingPubs) {
            await ctx.db.delete(pub._id);
        }

        console.log("🗑️ Cleared all existing content");

        // Now seed fresh data (same data as seedAllContent but without checks)
        // Stories
        const storiesData = [
            {
                title: 'Reclaiming Her Ancestral Land',
                story: 'After her husband passed away, Maria faced years of legal battles when relatives tried to seize her family farm. With the help of LSF paralegals, she obtained a land title deed and secured her children\'s future. "LSF gave me back my dignity," she says. Today, Maria runs a successful farming cooperative that employs 15 women from her village.',
                personName: 'Maria Mwakalukwa',
                location: 'Kilolo, Iringa',
                imageUrl: '/lovable-uploads/story-land-rights.png',
                featured: true,
            },
            {
                title: 'Justice for Child Support',
                story: 'When Amina\'s husband abandoned her family, she struggled to provide for her two children alone. LSF paralegals helped her navigate the family court system to secure child support payments. "My children can now go to school and have proper meals," Amina shares with tears of gratitude.',
                personName: 'Amina Juma',
                location: 'Mtwara',
                imageUrl: '/lovable-uploads/story-child-support.png',
                featured: true,
            },
            {
                title: 'Legal Education for Youth',
                story: 'Through LSF\'s youth outreach program, over 500 students at Jitegemee Secondary School learned about their constitutional rights. "Before, we didn\'t know we had rights," says student leader Emmanuel Massawe.',
                personName: 'Emmanuel Massawe',
                location: 'Dar es Salaam',
                imageUrl: '/lovable-uploads/story-youth-education.png',
                featured: true,
            },
            {
                title: 'Resolving a 10-Year Water Dispute',
                story: 'Two villages in Dodoma had been fighting over a water source for a decade. LSF mediators facilitated community dialogue sessions that led to a shared water management agreement.',
                personName: 'Mzee Rashidi Omari',
                location: 'Dodoma',
                imageUrl: '/lovable-uploads/LSF beneficiaries .jpg',
                featured: false,
            },
            {
                title: 'Empowering Women Entrepreneurs',
                story: 'The Furaha Women\'s Cooperative in Arusha faced challenges registering their business. LSF provided legal training and helped them register their cooperative. Revenue has increased by 200% since formalization.',
                personName: 'Neema Kicheko',
                location: 'Arusha',
                imageUrl: '/lovable-uploads/wanawake tunaweza beenficiaries.jpg',
                featured: true,
            },
            {
                title: 'From Victim to Advocate',
                story: 'After experiencing domestic violence, Bahati sought help from LSF. With legal support, she obtained a protection order. Now she volunteers as a community paralegal, helping other women.',
                personName: 'Bahati Salum',
                location: 'Morogoro',
                imageUrl: '/lovable-uploads/Widows-GBV.png',
                featured: true,
            },
        ];
        for (const story of storiesData) {
            await ctx.db.insert("success_stories", story);
        }

        // Team Members
        const teamData = [
            { name: 'Lulu Ng\'wanakilala', position: 'Executive Director', bio: 'Lulu brings over 20 years of experience in legal aid and social justice.', image: '/lovable-uploads/lulu ng\'wanakilala-LSF_Executive Director.png', type: 'team' as const, order: 1 },
            { name: 'Hon. Fadhila Issa Mbega', position: 'Board Chairperson', bio: 'A distinguished legal professional and former Member of Parliament.', image: '/lovable-uploads/Board Chairperson.png', type: 'board' as const, order: 1 },
            { name: 'Dr. Michael Fundikira', position: 'Head of Programs', bio: 'Oversees all LSF programs including the paralegal network and Haki Yangu platform.', image: '/lovable-uploads/fadhila.jpeg', type: 'team' as const, order: 2 },
            { name: 'Grace Mwinyimkuu', position: 'Finance Director', bio: 'Ensures LSF maintains the highest standards of financial accountability.', image: '/lovable-uploads/WhatsApp Image 2025-01-15 at 13.40.44-2.jpeg', type: 'team' as const, order: 3 },
        ];
        for (const member of teamData) {
            await ctx.db.insert("team_members", member);
        }

        // News
        const newsData = [
            { title: 'LSF Signs Historic Partnership with DANIDA', excerpt: 'A new five-year agreement will strengthen paralegal networks across six regions.', content: '<p>The Legal Services Facility has signed a landmark partnership with DANIDA.</p>', date: '2024-12-15', image: '/lovable-uploads/Danida-lsf-signing.jpg', category: 'Partnerships', featured: true, seoTitle: 'LSF-DANIDA Partnership', seoDescription: 'Historic agreement to expand legal aid.', keywords: ['partnership', 'DANIDA'] },
            { title: 'Mama Samia Legal Aid Campaign Reaches 25,000', excerpt: 'The nationwide campaign provided free legal services across all 26 regions.', content: '<p>LSF\'s flagship campaign has reached over 25,000 citizens.</p>', date: '2024-11-28', image: '/lovable-uploads/mama samia legal aid campaingn.jpg', category: 'Campaigns', featured: true, seoTitle: 'Mama Samia Campaign', seoDescription: 'Legal aid reaches 25,000 citizens.', keywords: ['campaign'] },
            { title: 'Haki Yangu App Surpasses 20,000 Downloads', excerpt: 'The revolutionary mobile application transforms how Tanzanians access legal information.', content: '<p>The Haki Yangu app has surpassed 20,000 downloads.</p>', date: '2024-09-05', image: '/lovable-uploads/NEW-HAKI-YANGU-APP.png', category: 'Digital Innovation', featured: true, seoTitle: 'Haki Yangu App Milestone', seoDescription: 'App reaches 20,000 downloads.', keywords: ['app', 'technology'] },
        ];
        for (const article of newsData) {
            await ctx.db.insert("news", article);
        }

        // Opportunities
        const opportunitiesData = [
            { title: 'Community Paralegal Coordinator', description: 'Manage and support our network of community paralegals across the Southern Highlands zone.', type: 'job' as const, category: 'Legal Services', department: 'Programs', location: 'Iringa, Tanzania', duration: 'Full-time', salary: 'TZS 2,500,000 - 3,500,000', deadline: '2025-02-15', status: 'open' as const, requirements: ['Bachelor\'s in Law or Social Work', '3+ years experience'], responsibilities: ['Coordinate 50+ paralegals', 'Conduct training'] },
            { title: 'Volunteer Paralegal Program', description: 'Join our volunteer paralegal program and make a difference in your community.', type: 'other' as const, category: 'Volunteer', department: 'Outreach', location: 'Various locations', duration: 'Flexible (min 6 months)', salary: 'Volunteer (stipend)', deadline: '2025-03-30', status: 'open' as const, requirements: ['Secondary education', 'Commitment to service'], responsibilities: ['Provide legal info', 'Assist with documents'] },
        ];
        for (const opp of opportunitiesData) {
            await ctx.db.insert("opportunities", opp);
        }

        // Publications
        const publicationsData = [
            { title: 'LSF Annual Report 2024', description: 'Celebrating 10 years of legal empowerment across Tanzania.', publishedDate: '2024-12-01', category: 'report', type: 'report', coverImageUrl: '/lovable-uploads/LSF 2024 ANNUAL REPORT (Mobile Video).png', pdfUrl: '/downloads/annual-report-2024.pdf', featured: true },
            { title: 'Community Paralegal Training Manual', description: 'Essential guide for community paralegals.', publishedDate: '2024-06-01', category: 'guide', type: 'guide', coverImageUrl: '/lovable-uploads/LSF-HIGHLIGHT-PRALEGAL.png', pdfUrl: '/downloads/training-manual.pdf', featured: false },
        ];
        for (const pub of publicationsData) {
            await ctx.db.insert("publications", pub);
        }

        console.log("✅ All content cleared and reseeded successfully!");
        return { success: true, message: "All old data cleared and new content inserted" };
    },
});

// Master seed function that populates all content tables with realistic LSF data
export const seedAllContent = mutation({
    args: {},
    handler: async (ctx) => {
        // ===== SUCCESS STORIES =====
        const existingStories = await ctx.db.query("success_stories").collect();
        if (existingStories.length === 0) {
            const storiesData = [
                {
                    title: 'Reclaiming Her Ancestral Land',
                    story: 'After her husband passed away, Maria faced years of legal battles when relatives tried to seize her family farm. With the help of LSF paralegals, she obtained a land title deed and secured her children\'s future. "LSF gave me back my dignity," she says. Today, Maria runs a successful farming cooperative that employs 15 women from her village.',
                    personName: 'Maria Mwakalukwa',
                    location: 'Kilolo, Iringa',
                    imageUrl: '/lovable-uploads/story-land-rights.png',
                    featured: true,
                },
                {
                    title: 'Justice for Child Support',
                    story: 'When Amina\'s husband abandoned her family, she struggled to provide for her two children alone. LSF paralegals helped her navigate the family court system to secure child support payments. "My children can now go to school and have proper meals," Amina shares with tears of gratitude. She has since become a community advocate for women\'s rights.',
                    personName: 'Amina Juma',
                    location: 'Mtwara',
                    imageUrl: '/lovable-uploads/story-child-support.png',
                    featured: true,
                },
                {
                    title: 'Legal Education for Youth',
                    story: 'Through LSF\'s youth outreach program, over 500 students at Jitegemee Secondary School learned about their constitutional rights. "Before, we didn\'t know we had rights," says student leader Emmanuel Massawe. "Now we can identify injustice and know where to seek help." Several students have gone on to study law and return to serve their communities.',
                    personName: 'Emmanuel Massawe',
                    location: 'Dar es Salaam',
                    imageUrl: '/lovable-uploads/story-youth-education.png',
                    featured: true,
                },
                {
                    title: 'Resolving a 10-Year Water Dispute',
                    story: 'Two villages in Dodoma had been fighting over a water source for a decade, with tensions escalating to violence. LSF mediators facilitated community dialogue sessions that led to a shared water management agreement. "We are neighbors again," says Elder Mzee Rashidi. "Our grandchildren will inherit peace, not conflict."',
                    personName: 'Mzee Rashidi Omari',
                    location: 'Dodoma',
                    imageUrl: '/lovable-uploads/LSF beneficiaries .jpg',
                    featured: false,
                },
                {
                    title: 'Empowering Women Entrepreneurs',
                    story: 'The Furaha Women\'s Cooperative in Arusha faced challenges registering their business and protecting their handcraft designs. LSF provided legal training and helped them register their cooperative and trademark. Revenue has increased by 200% since formalization. "We are not just sellers now—we are businesswomen," declares chairperson Neema Kicheko.',
                    personName: 'Neema Kicheko',
                    location: 'Arusha',
                    imageUrl: '/lovable-uploads/wanawake tunaweza beenficiaries.jpg',
                    featured: true,
                },
                {
                    title: 'From Victim to Advocate',
                    story: 'After experiencing domestic violence, Bahati sought help from LSF. With legal support, she obtained a protection order and divorced safely. Now she volunteers as a community paralegal, helping other women in similar situations. "What happened to me gave me purpose," she says. "I help women know they have options."',
                    personName: 'Bahati Salum',
                    location: 'Morogoro',
                    imageUrl: '/lovable-uploads/Widows-GBV.png',
                    featured: true,
                },
            ];
            for (const story of storiesData) {
                await ctx.db.insert("success_stories", story);
            }
        }

        // ===== TEAM MEMBERS =====
        const existingTeam = await ctx.db.query("team_members").collect();
        if (existingTeam.length === 0) {
            const teamData = [
                {
                    name: 'Lulu Ng\'wanakilala',
                    position: 'Executive Director',
                    bio: 'Lulu brings over 20 years of experience in legal aid and social justice. Under her leadership, LSF has expanded to cover all 184 districts of Tanzania and transformed over 426,000 lives through accessible legal services.',
                    image: '/lovable-uploads/lulu ng\'wanakilala-LSF_Executive Director.png',
                    type: 'team' as const,
                    order: 1,
                    linkedin: 'https://linkedin.com',
                    email: 'lulu@lsftz.org',
                },
                {
                    name: 'Hon. Fadhila Issa Mbega',
                    position: 'Board Chairperson',
                    bio: 'A distinguished legal professional and former Member of Parliament, Hon. Fadhila provides strategic guidance and ensures governance excellence at LSF.',
                    image: '/lovable-uploads/Board Chairperson.png',
                    type: 'board' as const,
                    order: 1,
                    linkedin: 'https://linkedin.com',
                },
                {
                    name: 'Dr. Michael Fundikira',
                    position: 'Head of Programs',
                    bio: 'Dr. Fundikira oversees all LSF programs including the paralegal network, Haki Yangu digital platform, and community legal education initiatives across Tanzania.',
                    image: '/lovable-uploads/fadhila.jpeg',
                    type: 'team' as const,
                    order: 2,
                },
                {
                    name: 'Grace Mwinyimkuu',
                    position: 'Finance & Administration Director',
                    bio: 'With expertise in nonprofit financial management, Grace ensures LSF maintains the highest standards of accountability and transparency to our donors and beneficiaries.',
                    image: '/lovable-uploads/WhatsApp Image 2025-01-15 at 13.40.44-2.jpeg',
                    type: 'team' as const,
                    order: 3,
                },
                {
                    name: 'John Mwakatobe',
                    position: 'Monitoring & Evaluation Manager',
                    bio: 'John leads the data-driven assessment of LSF programs, ensuring we measure impact and continuously improve our services to communities.',
                    image: '/lovable-uploads/Danish amabssador.png',
                    type: 'team' as const,
                    order: 4,
                },
                {
                    name: 'Prof. Issa Shivji',
                    position: 'Board Member',
                    bio: 'Renowned constitutional scholar and human rights advocate who brings decades of experience in legal reform and social justice to LSF\'s governance.',
                    image: '/lovable-uploads/kjmnkjlk.jpeg',
                    type: 'board' as const,
                    order: 2,
                },
            ];
            for (const member of teamData) {
                await ctx.db.insert("team_members", member);
            }
        }

        // ===== NEWS ARTICLES =====
        const existingNews = await ctx.db.query("news").collect();
        if (existingNews.length === 0) {
            const newsData = [
                {
                    title: 'LSF Signs Historic Partnership with DANIDA to Expand Legal Aid Services',
                    excerpt: 'A new five-year agreement will strengthen paralegal networks across six regions and introduce innovative digital solutions for justice access.',
                    content: '<p>The Legal Services Facility (LSF) has signed a landmark partnership agreement with the Danish International Development Agency (DANIDA) to expand legal aid services across Tanzania.</p><p>This five-year agreement, valued at $15 million, will strengthen paralegal networks across six regions and introduce innovative digital solutions for justice access. The partnership will train 200 new community paralegals and establish 50 new legal aid clinics in underserved areas.</p><p>"This partnership represents a significant step forward in our mission to ensure justice for every Tanzanian," said Executive Director Lulu Ng\'wanakilala.</p>',
                    date: '2024-12-15',
                    image: '/lovable-uploads/Danida-lsf-signing.jpg',
                    category: 'Partnerships',
                    featured: true,
                    seoTitle: 'LSF Signs Partnership with DANIDA - Expanded Legal Aid',
                    seoDescription: 'Historic five-year agreement to expand legal aid services across Tanzania.',
                    keywords: ['partnership', 'DANIDA', 'legal aid', 'Tanzania'],
                },
                {
                    title: 'Mama Samia Legal Aid Campaign Reaches 25,000 Citizens',
                    excerpt: 'The nationwide campaign provided free legal services to vulnerable communities across all 26 regions of Tanzania.',
                    content: '<p>LSF\'s flagship Mama Samia Legal Aid Campaign has successfully reached over 25,000 citizens across all 26 regions of Tanzania, providing free legal consultations, document preparation, and court representation.</p><p>The campaign focused on women\'s rights, land disputes, and family law matters, addressing the most pressing legal needs of vulnerable communities.</p>',
                    date: '2024-11-28',
                    image: '/lovable-uploads/mama samia legal aid campaingn.jpg',
                    category: 'Campaigns',
                    featured: true,
                    seoTitle: 'Mama Samia Campaign - 25,000 Citizens Served',
                    seoDescription: 'Nationwide legal aid campaign reaches vulnerable communities across Tanzania.',
                    keywords: ['legal aid', 'campaign', 'women rights'],
                },
                {
                    title: 'LSF Receives IGP Award for Strengthening Police-Community Relations',
                    excerpt: 'The Inspector General of Police recognized LSF\'s efforts in training officers on human rights and community policing.',
                    content: '<p>LSF has been honored with a prestigious award from the Inspector General of Police for its outstanding contribution to strengthening police-community relations in Tanzania.</p><p>The award recognizes LSF\'s comprehensive training program that has educated over 3,000 police officers on human rights, legal procedures, and community policing principles.</p>',
                    date: '2024-10-10',
                    image: '/lovable-uploads/lsf from IGP sirro police award.jpg',
                    category: 'Recognition',
                    featured: false,
                    seoTitle: 'LSF Receives IGP Award',
                    seoDescription: 'Recognition for police-community relations training program.',
                    keywords: ['award', 'police', 'human rights', 'training'],
                },
                {
                    title: 'Haki Yangu App Surpasses 20,000 Downloads',
                    excerpt: 'The revolutionary mobile application continues to transform how Tanzanians access legal information and services.',
                    content: '<p>LSF\'s Haki Yangu mobile application has surpassed 20,000 downloads, marking a significant milestone in digital legal services delivery in Tanzania.</p><p>The app provides users with access to legal information in Swahili, connects them with nearby paralegals, and allows for anonymous whistleblowing of injustices.</p>',
                    date: '2024-09-05',
                    image: '/lovable-uploads/NEW-HAKI-YANGU-APP.png',
                    category: 'Digital Innovation',
                    featured: true,
                    seoTitle: 'Haki Yangu App - 20,000 Downloads',
                    seoDescription: 'Mobile app transforms legal service access in Tanzania.',
                    keywords: ['app', 'digital', 'technology', 'legal tech'],
                },
                {
                    title: 'LSF Launches Climate Justice Initiative in Partnership with EU',
                    excerpt: 'New program addresses environmental legal challenges affecting farming communities due to climate change.',
                    content: '<p>LSF has launched an innovative Climate Justice Initiative in partnership with the European Union to address environmental legal challenges affecting farming communities.</p><p>The program will provide legal support for communities facing land disputes related to climate migration, water rights conflicts, and environmental degradation.</p>',
                    date: '2024-08-20',
                    image: '/lovable-uploads/enabel -un-lsf.png',
                    category: 'Programs',
                    featured: false,
                    seoTitle: 'Climate Justice Initiative Launch',
                    seoDescription: 'New EU partnership addresses environmental legal challenges.',
                    keywords: ['climate', 'environment', 'EU', 'justice'],
                },
            ];
            for (const article of newsData) {
                await ctx.db.insert("news", article);
            }
        }

        // ===== OPPORTUNITIES =====
        const existingOpportunities = await ctx.db.query("opportunities").collect();
        if (existingOpportunities.length === 0) {
            const opportunitiesData = [
                {
                    title: 'Community Paralegal Coordinator',
                    description: 'We are seeking an experienced coordinator to manage and support our network of community paralegals across the Southern Highlands zone. The ideal candidate will have strong organizational skills and a passion for grassroots legal empowerment.',
                    type: 'job' as const,
                    category: 'Legal Services',
                    department: 'Programs',
                    location: 'Iringa, Tanzania',
                    duration: 'Full-time (Permanent)',
                    salary: 'TZS 2,500,000 - 3,500,000 monthly',
                    deadline: '2025-02-15',
                    status: 'open' as const,
                    applicationLink: 'https://careers.lsftz.org/apply',
                    requirements: [
                        'Bachelor\'s degree in Law, Social Work, or related field',
                        'Minimum 3 years experience in community development',
                        'Fluency in Swahili and English',
                        'Valid motorcycle license preferred',
                    ],
                    responsibilities: [
                        'Coordinate and supervise 50+ community paralegals',
                        'Conduct training and capacity building sessions',
                        'Monitor and evaluate program activities',
                        'Prepare monthly and quarterly reports',
                    ],
                    benefits: [
                        'Health insurance coverage',
                        'Professional development opportunities',
                        'Transportation allowance',
                    ],
                },
                {
                    title: 'Digital Innovation Consultant',
                    description: 'LSF seeks a consultant to enhance our Haki Yangu mobile application with new features including AI-powered legal assistance and improved offline functionality.',
                    type: 'consultancy' as const,
                    category: 'Technology',
                    department: 'ICT',
                    location: 'Dar es Salaam (Remote options available)',
                    duration: '6 months',
                    salary: 'Competitive consultancy rate',
                    deadline: '2025-01-31',
                    status: 'open' as const,
                    applicationLink: 'https://careers.lsftz.org/consultancy',
                    requirements: [
                        'Proven experience in mobile app development',
                        'Knowledge of AI/ML technologies',
                        'Experience with legal tech is a plus',
                        'Strong portfolio of previous work',
                    ],
                    responsibilities: [
                        'Design and implement new app features',
                        'Improve app performance and user experience',
                        'Integrate AI chatbot for legal queries',
                        'Train LSF staff on system maintenance',
                    ],
                },
                {
                    title: 'Volunteer Paralegal Program',
                    description: 'Join our volunteer paralegal program and make a difference in your community. We provide comprehensive training and ongoing support. Perfect for law students or community members passionate about justice.',
                    type: 'other' as const,
                    category: 'Volunteer',
                    department: 'Community Outreach',
                    location: 'Various locations across Tanzania',
                    duration: 'Flexible (minimum 6 months commitment)',
                    salary: 'Volunteer (stipend provided)',
                    deadline: '2025-03-30',
                    status: 'open' as const,
                    applicationLink: 'https://volunteer.lsftz.org',
                    requirements: [
                        'Minimum secondary school education',
                        'Commitment to community service',
                        'Good communication skills',
                        'Willingness to learn',
                    ],
                    responsibilities: [
                        'Provide basic legal information to community members',
                        'Assist with document preparation',
                        'Conduct community awareness sessions',
                        'Refer complex cases to LSF lawyers',
                    ],
                    benefits: [
                        'Free paralegal training certification',
                        'Monthly stipend for transport',
                        'Professional reference letters',
                    ],
                },
                {
                    title: 'Grant: Gender Justice Research Fund',
                    description: 'LSF invites researchers and civil society organizations to apply for grants to conduct research on gender justice issues in Tanzania. Priority areas include GBV prevention, women\'s land rights, and access to family courts.',
                    type: 'grant' as const,
                    category: 'Research',
                    department: 'Research & Advocacy',
                    location: 'Tanzania (nationwide)',
                    duration: '12-18 months',
                    salary: 'Up to TZS 50,000,000 per project',
                    deadline: '2025-02-28',
                    status: 'open' as const,
                    applicationLink: 'https://grants.lsftz.org/gender-justice',
                    requirements: [
                        'Registered organization or academic institution',
                        'Demonstrated research capacity',
                        'Focus on gender justice issues',
                        'Clear methodology and budget',
                    ],
                },
            ];
            for (const opportunity of opportunitiesData) {
                await ctx.db.insert("opportunities", opportunity);
            }
        }

        // ===== PUBLICATIONS =====
        const existingPubs = await ctx.db.query("publications").collect();
        if (existingPubs.length === 0) {
            const publicationsData = [
                {
                    title: 'LSF Annual Report 2024: A Decade of Justice',
                    description: 'Celebrating 10 years of legal empowerment across Tanzania. This comprehensive report documents our journey, impact, and vision for the future.',
                    publishedDate: '2024-12-01',
                    category: 'report',
                    type: 'report',
                    coverImageUrl: '/lovable-uploads/LSF 2024 ANNUAL REPORT (Mobile Video).png',
                    pdfUrl: '/downloads/lsf-annual-report-2024.pdf',
                    featured: true,
                },
                {
                    title: 'Policy Brief: Reforming Legal Aid Legislation in Tanzania',
                    description: 'Analysis and recommendations for strengthening the legal framework governing legal aid services and paralegal practice.',
                    publishedDate: '2024-09-15',
                    category: 'policy-brief',
                    type: 'policy-brief',
                    coverImageUrl: '/lovable-uploads/Screenshot 2024-02-28 at 13.36.54.png',
                    pdfUrl: '/downloads/legal-aid-policy-brief.pdf',
                    featured: true,
                },
                {
                    title: 'Community Paralegal Training Manual (3rd Edition)',
                    description: 'The essential guide for community paralegals, covering legal fundamentals, mediation techniques, and case documentation.',
                    publishedDate: '2024-06-01',
                    category: 'guide',
                    type: 'guide',
                    coverImageUrl: '/lovable-uploads/LSF-HIGHLIGHT-PRALEGAL.png',
                    pdfUrl: '/downloads/paralegal-training-manual.pdf',
                    featured: false,
                },
                {
                    title: 'Research: Access to Justice in Rural Tanzania',
                    description: 'A comprehensive study examining barriers to justice and the impact of community-based legal services in underserved regions.',
                    publishedDate: '2024-03-20',
                    category: 'research',
                    type: 'research',
                    coverImageUrl: '/lovable-uploads/Land (Uyui).JPG',
                    pdfUrl: '/downloads/rural-justice-research.pdf',
                    featured: true,
                },
            ];
            for (const pub of publicationsData) {
                await ctx.db.insert("publications", pub);
            }
        }

        console.log("✅ All content seeded successfully!");
        return { success: true, message: "All content tables populated with realistic data" };
    },
});
