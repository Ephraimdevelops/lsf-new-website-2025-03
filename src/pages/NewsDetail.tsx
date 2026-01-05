
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
    .slice(0, 3)
    .map(item => ({ ...item, id: item._id }));


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
      {/* Cinematic Hero with Fixed Background */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Fixed background - parallax effect */}
        <div
          className="absolute inset-0 z-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url(${newsItem.image})` }}
        >
          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent"></div>
        </div>

        {/* Back button */}
        <div className="absolute top-8 left-0 right-0 z-20">
          <div className="container mx-auto px-4">
            <Link to="/news" className="inline-flex items-center text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
              <ArrowLeft size={16} className="mr-1" />
              Back to News
            </Link>
          </div>
        </div>

        {/* Hero Content - Center aligned */}
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          {/* Category */}
          <div className="mb-6">
            <span className="inline-flex items-center bg-primary text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-wider shadow-lg">
              {newsItem.category}
            </span>
          </div>

          {/* Date and Author */}
          <div className="flex items-center justify-center gap-4 text-white/80 text-sm mb-8">
            <span className="flex items-center">
              <Calendar size={14} className="mr-2" />
              {newsItem.date}
            </span>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <span>{newsItem.author}</span>
          </div>

          {/* Title */}
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight drop-shadow-2xl">
            {newsItem.title}
          </h1>

          {/* Excerpt */}
          <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {newsItem.excerpt}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Article Content - Clean Single Column */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Article Body */}
            <article className="prose prose-lg prose-neutral max-w-none">
              <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
            </article>

            {/* Tags */}
            {newsItem.keywords && newsItem.keywords.length > 0 && (
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <p className="text-sm text-neutral-500 uppercase tracking-wider font-medium mb-4">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {newsItem.keywords.map(tag => (
                    <span key={tag} className="bg-neutral-100 text-neutral-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <p className="text-sm text-neutral-500 uppercase tracking-wider font-medium mb-4 flex items-center gap-2">
                <Share2 size={16} />
                Share this article
              </p>
              <div className="flex gap-3">
                <button className="bg-[#1877F2] text-white p-3 rounded-full hover:opacity-90 transition-opacity shadow-lg">
                  <Facebook size={20} />
                </button>
                <button className="bg-black text-white p-3 rounded-full hover:opacity-90 transition-opacity shadow-lg">
                  <Twitter size={20} />
                </button>
                <button className="bg-[#0A66C2] text-white p-3 rounded-full hover:opacity-90 transition-opacity shadow-lg">
                  <Linkedin size={20} />
                </button>
                <button className="bg-primary text-white p-3 rounded-full hover:opacity-90 transition-opacity shadow-lg">
                  <Mail size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Stories - Premium Grid */}
      {relatedNews.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">Continue Reading</p>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">More Stories</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-neutral-500 mb-2">{item.date}</p>
                    <h3 className="font-bold text-lg text-neutral-900 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/news">
                <Button variant="outline" size="lg" className="rounded-full px-8 font-bold">
                  View All News
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary-dark to-neutral-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Support Our Mission</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Help us continue bringing stories of justice and impact to communities across Tanzania.
          </p>
          <Link to="/donate">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold rounded-full px-10">
              Donate Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetail;
