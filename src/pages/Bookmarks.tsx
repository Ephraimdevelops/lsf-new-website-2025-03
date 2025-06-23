
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Bookmarks = () => {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <Layout>
      <Container size="lg" className="py-20">
        <div className="text-center mb-12">
          <Typography variant="h1" className="mb-4">
            Your Bookmarks
          </Typography>
          <Typography variant="body" className="text-neutral-gray">
            Pages you've saved for later reading
          </Typography>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <Typography variant="h3" className="mb-2">No bookmarks yet</Typography>
            <Typography variant="body" className="text-neutral-gray">
              Start exploring and bookmark pages you want to revisit
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                <Link to={bookmark} className="flex-1 hover:text-primary transition-colors">
                  <Typography variant="body" className="font-medium">
                    {bookmark}
                  </Typography>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBookmark(bookmark)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default Bookmarks;
