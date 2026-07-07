import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export const NoticeCards = ({ notices, onEdit, onDelete, onNewNotice }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Notices & Updates</h2>
        <Button onClick={onNewNotice} className="shadow-sm">
          <PlusCircle className="mr-2 h-4 w-4" /> New Notice
        </Button>
      </div>

      <div className="space-y-5">
        {notices.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No notices yet</p>
            <p className="text-sm mt-1">Create your first notice to get started.</p>
          </div>
        ) : (
          notices.map((notice) => (
            <Card
              key={notice.id}
              className={`card-hover ${notice.important ? "border-red-200/70" : "border-border/50"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {notice.title}
                      {notice.important && (
                        <Badge variant="default" className="bg-red-100 text-red-700 border-red-200 text-[10px]">
                          Important
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {notice.date}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => onEdit(notice)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(notice.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {notice.message}
                </p>
                {notice.link && (
                  <div className="mt-2 text-xs">
                    <a
                      href={notice.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      Link: {notice.link}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
};
