import {createSlice}from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[ chatId ] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role, id } = action.payload
            const message = {
                id: id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                content,
                role,
            }
            state.chats[ chatId ].messages.push(message)
            if (state.chats[chatId]) {
                state.chats[chatId].lastUpdated = new Date().toISOString()
            }
        },
        updateMessage: (state, action) => {
            const { chatId, messageId, content, role } = action.payload
            const messages = state.chats[chatId]?.messages
            if (!messages) return
            const index = messages.findIndex(msg => msg.id === messageId)
            if (index !== -1) {
                state.chats[chatId].messages[index] = {
                    ...messages[index],
                    content,
                    role: role || messages[index].role,
                }
            }
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[ chatId ].messages.push(...messages)
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        removeChat: (state, action) => {
            const chatId = action.payload
            delete state.chats[chatId]
            if (state.currentChatId === chatId) {
                const remainingChatIds = Object.keys(state.chats)
                state.currentChatId = remainingChatIds.length ? remainingChatIds[0] : null
            }
        }
    }
})

export const {
    setChats,
    setCurrentChatId,
    setIsLoading,
    setError,
    createNewChat,
    addNewMessage,
    addMessages,
    updateMessage,
    removeChat,
} = chatSlice.actions
export default chatSlice.reducer