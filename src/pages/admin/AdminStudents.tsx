import React, { useMemo, useState } from "react";
import { PencilLine, Plus, Search, Users, XCircle } from "lucide-react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppData } from "@/contexts/AppDataContext";

interface StudentFormState {
  id?: string;
  name: string;
  email: string;
  collegeId: string;
}

const emptyForm: StudentFormState = {
  name: "",
  email: "",
  collegeId: "",
};

const AdminStudents = () => {
  const { bookings, busesWithDetails, cancelBooking, saveUser, students } = useAppData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<StudentFormState>(emptyForm);

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const searchTerm = search.toLowerCase();
        return (
          student.name.toLowerCase().includes(searchTerm) ||
          student.email.toLowerCase().includes(searchTerm) ||
          student.collegeId?.toLowerCase().includes(searchTerm)
        );
      }),
    [search, students],
  );

  const openCreateDialog = () => {
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (studentId: string) => {
    const student = students.find((candidate) => candidate.id === studentId);

    if (!student) {
      return;
    }

    setForm({
      id: student.id,
      name: student.name,
      email: student.email,
      collegeId: student.collegeId || "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.collegeId.trim()) {
      return;
    }

    saveUser({
      id: form.id,
      name: form.name.trim(),
      email: form.email.trim(),
      collegeId: form.collegeId.trim(),
      role: "student",
    });
    setDialogOpen(false);
  };

  const handleCancelBooking = (bookingId: string) => {
    const result = cancelBooking(bookingId);

    if (result.success) {
      toast.success(result.message);
      return;
    }

    toast.error(result.message);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-muted-foreground">Maintain student records and resolve booking issues from a single table.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">{students.length} Students</Badge>
            <Button className="gradient-primary text-primary-foreground" onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const booking = bookings.find((candidate) => candidate.studentId === student.id && candidate.status === "active");
                  const bus = booking ? busesWithDetails.find((candidate) => candidate.id === booking.busId) : null;

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.collegeId || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={booking ? "bg-success" : "bg-muted text-muted-foreground"}>
                          {booking ? "Active" : "No Booking"}
                        </Badge>
                      </TableCell>
                      <TableCell>{bus?.busNumber || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {booking && (
                            <Button variant="ghost" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel ride
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(student.id)}>
                            <PencilLine className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No students matched your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Student name"
            />
            <Input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="student@geu.edu.in"
            />
            <Input
              value={form.collegeId}
              onChange={(event) => setForm((current) => ({ ...current, collegeId: event.target.value }))}
              placeholder="GEU2024012"
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary text-primary-foreground" onClick={handleSave}>
                Save Student
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminStudents;
