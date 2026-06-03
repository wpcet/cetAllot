import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export const DepartmentCards = ({
  departments,
  onEdit,
  onDelete,
  onNewDepartment,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Department Management</h2>
        <Button onClick={onNewDepartment} className="shadow-sm">
          <PlusCircle className="mr-2 h-4 w-4" /> New Department
        </Button>
      </div>

      {departments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No departments yet</p>
          <p className="text-sm mt-1">Add a department to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <Card key={department.id} className="card-hover">
              <CardHeader>
                <CardTitle className="text-lg">{department.name}</CardTitle>
                <CardDescription>{department.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-foreground">{department.totalSeats}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Filled</p>
                    <p className="text-2xl font-bold text-primary">{department.filledSeats}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold text-green-600">
                      {department.totalSeats - department.filledSeats}
                    </p>
                  </div>
                </div>
                <div className="mt-4 w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${(department.filledSeats / department.totalSeats) * 100}%` }}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-border/40 pt-4">
                <Button size="sm" variant="outline" onClick={() => onEdit(department)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(department.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};
