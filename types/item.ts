type TodoItem = {
    createdAt: Date // the date and time the todo was created
    isComplete: boolean
    owner: string // the UID of the user who created it
    title: string
}