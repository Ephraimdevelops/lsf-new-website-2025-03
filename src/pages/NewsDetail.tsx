
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { ArrowLeft, Calendar, Share2, MessageSquare, Bookmark, Facebook, Twitter, Linkedin, Mail, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotFound from './NotFound';

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();

  const newsItemData = useQuery(api.news.getBySlugOrId, { identifier: id || '' });
  const newsItem = newsItemData ? { ...newsItemData, id: newsItemData._id } : null;

  const isLoading = newsItemData === undefined;

  // Related news could be a separate query
  const relatedNewsData = useQuery(api.news.get);
  const relatedNews = (relatedNewsData || [])
    .filter(item => item._id !== newsItemData?._id)
    .slice(0, 2)
    .map(item => ({ ...item, id: item._id }));

  // ... rest of component


  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!newsItem) {
    return <NotFound />;
  }

  return (
    <Layout>
      {/* Hero Section with Background */}
      <HeroSection
        icon={<Newspaper className="h-8 w-8" />}
        badge="News Article"
        title={newsItem.title}
        description={newsItem.excerpt}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Link to="/news" className="inline-flex items-center text-primary hover:underline mb-8">
            <ArrowLeft size={16} className="mr-1" />
            Back to News
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
                {newsItem.category}
              </span>
              {newsItem.keywords?.map(tag => (
                <span key={tag} className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>



            <div className="flex items-center text-gray-500 text-sm mb-8">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {newsItem.date}
              </span>
              <span className="mx-2">•</span>
              <span>{newsItem.author}</span>
            </div>

            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img
                src={newsItem.image}
                alt={newsItem.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: newsItem.content }}
              />

              {/* Share Links */}
              <div className="border-t border-b border-gray-200 mt-8 py-6">
                <div className="flex items-center gap-2 mb-4">
                  <Share2 size={18} />
                  <h4 className="font-bold">Share this article</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Facebook size={14} />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Twitter size={14} />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Linkedin size={14} />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Mail size={14} />
                    Email
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Related News */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Related News</h3>
                <div className="space-y-6">
                  {relatedNews.map((item) => (
                    <Link key={item.id} to={`/news/${item.id}`} className="flex gap-4 group">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.date}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Latest News */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Latest News</h3>
                <div className="space-y-6">
                  {/* We'll show the same "related news" here as a placeholder */}
                  {relatedNews.map((item) => (
                    <Link key={`latest-${item.id}`} to={`/news/${item.id}`} className="flex gap-4 group">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.date}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button variant="link" className="mt-4 w-full justify-center">
                  View All News
                </Button>
              </div>

              {/* CTA */}
              <div className="bg-primary text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Get Involved</h3>
                <p className="mb-4">Support our mission to increase access to justice for all Tanzanians.</p>
                <Link to="/donate">
                  <Button className="w-full bg-white text-primary hover:bg-white/90">
                    Donate Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetail;
