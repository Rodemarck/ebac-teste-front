import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getStatus, Task } from "../../types/task";
import api from "../../api";



type TaskState = {
  items: Task[];
  loading: boolean;
  error: string | null;
};

type TaskRequest = {
  title: string;
  description: string;
  status: string;
  deadLine: Date;
}

const initialState: TaskState = {
  items: [],
  loading: false,
  error: null,
};

const convTask = (task: Task): Task => {
  switch (task.status) {
    case "Concluída": task.status = "DONE"; break;
    case "Em andamento": task.status = "IN_PROGRESS"; break;
    case "Pendente": task.status = "PENDING"
  }
  return task
}

// REQUISIÇÃO PARA API NO BECK
export const fetchTasks = createAsyncThunk("task/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await api.get("/task");
    console.log(response.data)
    return response.data.tasks;
  } catch (error: any) {
    return thunkAPI.rejectWithValue("Erro ao buscar tarefas.");
  }
});

export const fetchTaskById = createAsyncThunk("task/fetchById", async (id: number, thunkAPI) => {
  try {
    const response = await api.get(`/task/${id}`);
    return response.data.tasks;
  } catch (error: any) {
    return thunkAPI.rejectWithValue("Erro ao buscar tarefa.");
  }
});

export const createTask = createAsyncThunk("task/create", async (task: TaskRequest, thunkAPI) => {
  try {
    const response = await api.post("/task", task);
    console.log("aaaaaa");
    console.log(response.data);


    return response.data.tasks;
  } catch (error: any) {
    return thunkAPI.rejectWithValue("Erro ao criar tarefa.");
  }
});

export const updateTask = createAsyncThunk("task/update", async (task: Task, thunkAPI) => {
  try {
    console.log('update')
    console.log(task)
    task = convTask(task)
    console.log('>>>>>')
    console.log(task)
    const response = await api.patch('/task', {
      id: task.id,
      title: task.title,
      deadLine: task.deadLine,
      status: task.status,
      description: task.description
    });
    console.log('<<<<');

    console.log(response)
    return response.data.tasks;
  } catch (error: any) {
    return thunkAPI.rejectWithValue("Erro ao atualizar tarefa.");
  }
});

export const deleteTask = createAsyncThunk("task/delete", async (id: number, thunkAPI) => {
  try {
    console.log('deletando');
    console.log(`/task/${id}`);


    await api.delete(`/task/${id}`);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue("Erro ao deletar tarefa.");
  }
});


// SLICE
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Buscar todas
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        console.log("Payload do fetchTasks:", action.payload);
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Criar
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items.push(action.payload);
        window.location.reload()
      })

      // Atualizar
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        window.location.reload()
      })

      // Remover
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        window.location.reload()
      });
  },
});

export default taskSlice.reducer;
