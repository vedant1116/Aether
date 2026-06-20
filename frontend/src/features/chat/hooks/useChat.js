import { initializeSocketConnection } from "../services/chat.socket";
import { getChats, getMessages, sendMessage, deleteChat } from "../services/chat.api";
import { setChats, setCurrentChatId, setError, setIsLoading, createNewChat, addMessages, addNewMessage, updateMessage, removeChat } from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = ()=>{
    const dispatch = useDispatch();

    const createTempId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`
    
    async function handleSendMessage({ message ,  chatId }){
            dispatch(setIsLoading(true))
            const tempMessageId = createTempId()
            const tempAiMessageId = createTempId()

            try {
                if (chatId) {
                    dispatch(addNewMessage({
                        chatId,
                        content: message,
                        role: "user",
                        id: tempMessageId,
                    }))
                    dispatch(addNewMessage({
                        chatId,
                        content: "Thinking...",
                        role: "ai",
                        id: tempAiMessageId,
                    }))
                }

                const data = await sendMessage({ message, chatId })
                const { chat, aiMessage } = data

                if (!chatId) {
                    dispatch(createNewChat({
                        chatId: chat._id,
                        title: chat.title,
                    }))
                    dispatch(addNewMessage({
                        chatId: chat._id,
                        content: message,
                        role: "user",
                    }))
                    dispatch(addNewMessage({
                        chatId: chat._id,
                        content: aiMessage.content,
                        role: aiMessage.role,
                    }))
                    dispatch(setCurrentChatId(chat._id))
                } else {
                    if (aiMessage) {
                        dispatch(updateMessage({
                            chatId,
                            messageId: tempAiMessageId,
                            content: aiMessage.content,
                            role: aiMessage.role,
                        }))
                    }
                }
            } catch (err) {
                if (chatId) {
                    dispatch(updateMessage({
                        chatId,
                        messageId: tempAiMessageId,
                        content: "Failed to generate response.",
                        role: "ai",
                    }))
                }
                dispatch(setError(err?.message || 'Failed to send message'))
            } finally {
                dispatch(setIsLoading(false))
            }

    }

      async function handleGetChats() {
        dispatch(setIsLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setIsLoading(false))
    }

    async function handleOpenChat(chatId, chats = {}) {

        const chatMessages = chats[ chatId ]?.messages || []

        if (chatMessages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                id: msg._id,
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }

    function handleCreateChat() {
        dispatch(setCurrentChatId(null))
    }

    async function handleDeleteChat(chatId) {
        if (!window.confirm("Delete this chat?")) return

        dispatch(setIsLoading(true))
        try {
            await deleteChat(chatId)
            dispatch(removeChat(chatId))
        } catch (err) {
            dispatch(setError(err?.message || "Failed to delete chat"))
        } finally {
            dispatch(setIsLoading(false))
        }
    }

     return {
        initializeSocketConnection,
         handleSendMessage,
         handleGetChats,
         handleOpenChat,
         handleCreateChat,
         handleDeleteChat,

     }
}