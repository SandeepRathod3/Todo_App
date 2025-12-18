import { useEffect, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit2,
  Filter,
  Search,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { deleteTodo, getTodos, updateStatus } from "../../lib/api";
import { format } from "date-fns";
import { CreateTodo } from "./CreateTode";
import { toast } from "sonner";

export interface Todo {
  _id: string;
  id: string;
  title: string;
  status: "pending" | "completed";
  description?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TodoTable() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
  });

  const loadTodos = async () => {
    try {
      setLoading(true);
      const res = await getTodos();
      setTodos(res.data || res);
      
      const pending = (res.data || res).filter((t: Todo) => t.status === "pending").length;
      const completed = (res.data || res).filter((t: Todo) => t.status === "completed").length;
      const now = new Date();
      const overdue = (res.data || res).filter((t: Todo) => 
        t.status === "pending" && t.expiryDate && new Date(t.expiryDate) < now
      ).length;
      
      setStats({
        total: (res.data || res).length,
        pending,
        completed,
        overdue,
      });
    } catch (error: any) {
      toast.error( error.message || "Failed to load todos")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
    
    const handleTodoCreated = () => loadTodos();
    window.addEventListener('todoCreated', handleTodoCreated);
    
    return () => {
      window.removeEventListener('todoCreated', handleTodoCreated);
    };
  }, []);

  const handleUpdateStatus = async (id: string, currentStatus: "pending" | "completed") => {
    try {
      const newStatus = currentStatus === "pending" ? "completed" : "pending";
      await updateStatus(id, newStatus);
      toast.success(`Todo marked as ${newStatus}`)
      loadTodos();
    } catch (error: any) {
      toast.error( error.message || "Failed to Update todo")
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) {
      return;
    }

    try {
      await deleteTodo(id);
      toast.success( "Todo deleted successfully")
      loadTodos();
    } catch (error: any) {
      toast.error( error.message || "Failed to load todos")
    }
  };

  const filteredTodos = todos
    ?.filter(t => {
      if (filter === "all") return true;
      if (filter === "overdue") {
        return t.status === "pending" && t.expiryDate && new Date(t.expiryDate) < new Date();
      }
      return t.status === filter;
    })
    .filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusBadge = (status: string, expiryDate?: string) => {
    const now = new Date();
    const isOverdue = status === "pending" && expiryDate && new Date(expiryDate) < now;
    
    if (isOverdue) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Overdue
        </Badge>
      );
    }
    
    if (status === "completed") {
      return (
        <Badge variant='default' className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    );
  };

  return (
    <Card className="border shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Your Tasks
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage and track your todos efficiently
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <CreateTodo />
            <Button
              variant="outline"
              size="icon"
              onClick={loadTodos}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Tasks</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Completed</p>
                  <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Overdue</p>
                  <p className="text-2xl font-bold text-red-900">{stats.overdue}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <Calendar className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {search ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {search ? "Try a different search term" : "Create your first task to get started"}
            </p>
            {!search && <CreateTodo />}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Task</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTodos.map((todo) => (
                  <TableRow 
                    key={todo._id || todo.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{todo.title}</p>
                        {todo.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {todo.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(todo.status, todo.expiryDate)}
                    </TableCell>
                    <TableCell>
                      {todo.expiryDate ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {format(new Date(todo.expiryDate), "MMM d, yyyy")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No due date</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(todo._id || todo.id, todo.status)}
                          className="gap-1"
                        >
                          <Edit2 className="h-3 w-3" />
                          {todo.status === "pending" ? "Mark Complete" : "Mark Pending"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(todo._id || todo.id)}
                          className="gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}