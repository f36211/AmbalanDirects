'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

type Link = {
  _id: string;
  Name: string;
  Links: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/links');
      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error(error);
      alert('Could not load links. Please check the console for more details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleEdit = (link: Link) => {
    setEditingLink({ ...link });
  };

  const handleCancel = () => {
    setEditingLink(null);
  };

  const handleSave = async () => {
    if (!editingLink) return;

    try {
      const response = await fetch('/api/links', {
        method: 'PUT',
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
        const errorData = await response.json();
        alert(`Failed to update link: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating the link.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Omit<Link, '_id'>) => {
    if (editingLink) {
      setEditingLink({ ...editingLink, [field]: e.target.value });
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Panel</h1>
        <div className="flex items-center gap-2">
          <Link href="/" passHref>
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main>
        {/* Mobile View - Card List */}
        <div className="md:hidden">
          {links.map((link) => (
            <Card key={link._id} className="mb-4">
              <CardHeader>
                <CardTitle>{link.Name}</CardTitle>
                <CardDescription className="truncate">{link.Links}</CardDescription>
              </CardHeader>
              <CardContent>
                {editingLink && editingLink._id === link._id ? (
                  <div className="flex flex-col gap-4">
                    <Input
                      value={editingLink.Name}
                      onChange={(e) => handleInputChange(e, 'Name')}
                      placeholder="Name"
                    />
                    <Input
                      value={editingLink.Links}
                      onChange={(e) => handleInputChange(e, 'Links')}
                      placeholder="Link URL"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" onClick={handleSave}>Save</Button>
                      <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => handleEdit(link)} className="w-full">Edit</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block">
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>Edit Links</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-gray-500 py-8">Loading links...</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Link URL</TableHead>
                        <TableHead className="text-right pr-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {links.map((link) => (
                        <TableRow key={link._id}>
                          {editingLink && editingLink._id === link._id ? (
                            <>
                              <TableCell className="min-w-[150px]">
                                <Input
                                  value={editingLink.Name}
                                  onChange={(e) => handleInputChange(e, 'Name')}
                                />
                              </TableCell>
                              <TableCell className="min-w-[200px]">
                                <Input
                                  value={editingLink.Links}
                                  onChange={(e) => handleInputChange(e, 'Links')}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button size="sm" onClick={handleSave}>Save</Button>
                                  <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
                                </div>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell className="font-medium">{link.Name}</TableCell>
                              <TableCell className="truncate max-w-xs">{link.Links}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(link)}
                                >
                                  Edit
                                </Button>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


