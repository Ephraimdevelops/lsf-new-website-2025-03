
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, Eye, Search } from 'lucide-react';

interface SEOFormData {
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  altText: string;
}

interface SEOOptimizedFormProps {
  type: 'news' | 'publication';
  onSubmit: (data: SEOFormData) => void;
  initialData?: Partial<SEOFormData>;
}

const SEOOptimizedForm = ({ type, onSubmit, initialData }: SEOOptimizedFormProps) => {
  const [formData, setFormData] = useState<SEOFormData>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    keywords: initialData?.keywords || [],
    altText: initialData?.altText || ''
  });

  const [keywordInput, setKeywordInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  // Auto-generate SEO title if empty
  const generateSEOTitle = () => {
    if (formData.title && !formData.seoTitle) {
      setFormData(prev => ({
        ...prev,
        seoTitle: `${prev.title} - Legal Services Facility Tanzania`
      }));
    }
  };

  // Auto-generate SEO description if empty
  const generateSEODescription = () => {
    if (formData.excerpt && !formData.seoDescription) {
      const truncated = formData.excerpt.length > 150 
        ? formData.excerpt.substring(0, 147) + '...'
        : formData.excerpt;
      setFormData(prev => ({
        ...prev,
        seoDescription: truncated
      }));
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Content Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                onBlur={generateSEOTitle}
                placeholder={`Enter ${type} title`}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Character count: {formData.title.length}/100 (optimal: 50-60)
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt/Summary *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                onBlur={generateSEODescription}
                placeholder={`Brief description of the ${type}`}
                rows={4}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Character count: {formData.excerpt.length}/300 (optimal: 150-160)
              </div>
            </div>

            <div>
              <Label htmlFor="altText">Image Alt Text *</Label>
              <Input
                id="altText"
                value={formData.altText}
                onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                placeholder="Descriptive text for the image"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Describe the image for accessibility and SEO (125 characters max)
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* SEO Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEO Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>SEO Tips:</strong> Use descriptive titles and meta descriptions. 
                  Include relevant keywords naturally. Keep titles under 60 characters and 
                  descriptions under 160 characters for optimal display in search results.
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="Title that appears in search results"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Character count: {formData.seoTitle.length}/60</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generateSEOTitle}
                  className="text-xs px-2 py-1 h-auto"
                >
                  Auto-generate
                </Button>
              </div>
              {formData.seoTitle.length > 60 && (
                <div className="text-xs text-red-500">Title may be truncated in search results</div>
              )}
            </div>

            <div>
              <Label htmlFor="seoDescription">SEO Meta Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="Description that appears in search results"
                rows={3}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Character count: {formData.seoDescription.length}/160</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generateSEODescription}
                  className="text-xs px-2 py-1 h-auto"
                >
                  Auto-generate
                </Button>
              </div>
              {formData.seoDescription.length > 160 && (
                <div className="text-xs text-red-500">Description may be truncated in search results</div>
              )}
            </div>

            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="keywords"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={handleKeywordKeyPress}
                  placeholder="Enter keyword and press Enter"
                />
                <Button type="button" onClick={addKeyword} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeKeyword(keyword)}
                  >
                    {keyword} ×
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Add 3-5 relevant keywords. Click on a keyword to remove it.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Search Result Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                {formData.seoTitle || formData.title || 'Your Title Here'}
              </div>
              <div className="text-green-600 text-sm">
                https://lsf.or.tz/{type}s/{formData.title.toLowerCase().replace(/\s+/g, '-')}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                {formData.seoDescription || formData.excerpt || 'Your description will appear here...'}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit">
            Publish {type}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SEOOptimizedForm;
