import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Input } from "../../components/ui/input";
import { createTodo } from "../../lib/api";
import { Label } from "@radix-ui/react-label";

export interface FormData {
  title: string;
  status: string;
  description: string;
}

export function CreateTode() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    status: "pending",
    description: "",
  });``

  const handleSubmit = async () => {
    await createTodo(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button /> Add Task
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Todo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 ">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={(e: any) =>
              setFormData((prop) => ({ ...prop, title: e.target.value }))
            }
          />

          <Label htmlFor="status"> Status</Label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="">
              <SelectValue placeholder=" Select Status">
                {formData.status}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="title">Title Description</Label>
          <Input
            type="text"
            id="description"
            placeholder="Task Description"
            value={formData.description}
            onChange={(e: any) =>
              setFormData((prev) => ({ ...prev, descrition: e.target.value }))
            }
          />
        </div>

        <Button onClick={handleSubmit}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
