'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, X, Edit3, ExternalLink, LogOut, Eye, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

type LinkType = {
  _id: string;
  Name: string;
  Links: string;
  order: number;
  createdAt: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // --- Data Fetching ---
  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/links');
     
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch links: ${response.statusText}`);
      }
     
      const data = await response.json();
      setLinks(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // --- Edit Handlers ---
  const handleEdit = (link: LinkType) => {
    setEditingLink({ ...link });
  };

  const handleCancel = () => {
    setEditingLink(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof Omit<LinkType, '_id' | 'order' | 'createdAt'>) => {
    if (editingLink) {
      setEditingLink({ ...editingLink, [field]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!editingLink) return;
    
    try {
      const response = await fetch('/api/links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingLink._id,
          Name: editingLink.Name,
          Links: editingLink.Links,
        }),
      });
      
      if (response.ok) {
        setEditingLink(null);
        await fetchLinks();
      } else {
        console.error('Failed to save link');
      }
    } catch (err) {
      console.error(err);
    }
  };

  

  // --- Logout Handler ---
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        // On successful logout, redirect to the login page.
        router.push('/login');
      } else {
        // Handle cases where the server fails to log out.
        setError('Logout failed. Please try again.');
        console.error('Logout failed with status:', response.status);
      }
    } catch (error) {
      // Handle network errors.
      setError('An error occurred during logout. Please check your connection.');
      console.error('An error occurred during logout', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500">Loading links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Link Manager</h1>
            <p className="text-sm text-gray-500 mt-1">Edit your link collection</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                View Site
              </Button>
            </Link>
            <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-gray-600 hover:text-gray-900"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </>
                )}
              </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <Card className="mb-4 bg-red-50 border-red-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="space-y-3">
          {!isLoading && links.length === 0 && !error ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-2">
                  <ExternalLink className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-gray-500">No links found. Start by adding a new one.</p>
              </CardContent>
            </Card>
          ) : (
            links.map((link, index) => (
              <Card key={link._id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  {editingLink && editingLink._id === link._id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Display Name</label>
                          <Input
                            value={editingLink.Name}
                            onChange={(e) => handleInputChange(e, 'Name')}
                            placeholder="Enter display name"
                            className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">URL</label>
                          <Input
                            value={editingLink.Links}
                            onChange={(e) => handleInputChange(e, 'Links')}
                            placeholder="https://example.com"
                            className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="outline" className="text-xs">
                          Position {index + 1}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={!editingLink.Name.trim() || !editingLink.Links.trim() || !isValidUrl(editingLink.Links)}
                            className="gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            className="gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-gray-900 truncate">{link.Name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {index + 1}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{link.Links}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(link)}
                        className="gap-2 ml-4"
                        disabled={!!editingLink}
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
