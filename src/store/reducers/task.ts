import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Task } from "../../types/task"
import api from "../../api";

type TaskState = {
    items: Task[]
}

const initialState: TaskState = {
    items: []
}

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        create: (state, action) => {
        },
        update: () => { },
        remove: () => { },
        list: () => { },
        get: () => { }
    }
})

export const { create, update, remove, list, get } = taskSlice.actions;

export default taskSlice.reducer;