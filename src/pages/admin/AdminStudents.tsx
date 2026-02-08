import React from 'react';
import { Users, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockUsers, mockBookings, getBusesWithDetails } from '@/data/mockData';
import { useState } from 'react';

const AdminStudents = () => {
  const [search, setSearch] = useState('');
  const students = mockUsers.filter(u => u.role === 'student');
  const allBuses = getBusesWithDetails();

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.collegeId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-muted-foreground">View registered students and their bookings</p>
          </div>
          <Badge variant="outline" className="text-sm w-fit">{students.length} Students</Badge>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Registered Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>College ID</TableHead>
                  <TableHead>Booking Status</TableHead>
                  <TableHead>Bus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(student => {
                  const booking = mockBookings.find(b => b.studentId === student.id && b.status === 'active');
                  const bus = booking ? allBuses.find(b => b.id === booking.busId) : null;
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.collegeId || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={booking ? 'bg-success' : 'bg-muted text-muted-foreground'}>
                          {booking ? 'Active' : 'No Booking'}
                        </Badge>
                      </TableCell>
                      <TableCell>{bus?.busNumber || '-'}</TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No students found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
