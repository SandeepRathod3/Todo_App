import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Table } from "lucide-react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { deleteTodo, getTodos, updateStatus } from "../../lib/api";
import { Input } from "../../components/ui/input";
import { CreateTode } from "./CreateTode";
export interface Todo {
  _id: string;
  title: string;
  status: "pending" | "completed";
  description?: string;
}


export default function TodoTable() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTodos();
      setTodos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const filteredTodos = todos
    .filter(t => (filter === "all" ? true : t.status === filter))
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <CreateTode  />

        <Input
          placeholder="Search..."
          className="w-60"
          onChange={(e:any) => setSearch(e.target.value)}
        />
      </div>

      <Select defaultValue="all" onValueChange={setFilter}>
        <SelectTrigger className="w-48 mb-4">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dscription</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTodos.map(todo => (
                <TableRow key={todo._id}>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell>{todo.status}</TableCell>
                  <TableCell>
                    {todo.description}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatus(
                          todo._id,
                          todo.status === "pending"
                            ? "completed"
                            : "pending"
                        ).then(loadTodos)
                      }
                    >
                      Toggle
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTodo(todo._id).then(loadTodos)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          
       
        </>
      )}
    </div>
  );
}
