import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'


const Dashboard = () => {
  const chat = useChat()
  const [ chatInput, setChatInput ] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
  }

  return (
    <main className='min-h-screen w-full bg-[#000000] p-3 text-white md:p-5'>
      <section className='mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl border   p-1 md:h-[calc(100vh-2.5rem)] md:gap-6 md:p-1 border-none'>
        <aside className='hidden h-full w-72 shrink-0 rounded-3xl border  bg-[#000000] p-4 md:flex md:flex-col'>
          <h1 className='mb-5 text-3xl font-semibold tracking-tight text-center text-[#db8a09]'>Aether</h1>

          <button
            type='button'
            onClick={chat.handleCreateChat}
            className='mb-4 w-full rounded-xl border border-white/60 bg-white/10 px-3 py-2 text-center text-base font-semibold text-white transition hover:border-white hover:bg-white/20'
          >
            + New Chat
          </button>

          <div className='space-y-2 flex-1 overflow-y-auto pr-2 scrollbar-hide'>
            {Object.values(chats)
              .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
              .map((chat, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded-xl border border-white/60 bg-transparent px-3 py-2 text-base font-medium text-white/90 transition hover:border-white hover:text-white'
                >
                  <button
                    type='button'
                    onClick={() => { openChat(chat.id) }}
                    className='text-left text-base font-medium text-white/90 transition hover:text-white'
                  >
                    {chat.title}
                  </button>
                  <button
                    type='button'
                    onClick={(event) => {
                      event.stopPropagation()
                      chat.handleDeleteChat(chat.id)
                    }}
                    className='ml-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white opacity-70 transition hover:border-white hover:bg-red-600 hover:text-white hover:opacity-100'
                    aria-label='Delete chat'
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-4 w-4'>
                      <path d='M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z' />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        </aside>

        <section className='relative max-w-3/5 mx-auto flex h-full min-w-0 flex-1 flex-col gap-4'>

          <div className='messages flex-1 space-y-3 overflow-y-auto pr-1 pb-30 scrollbar-hide'>
            {chats[ currentChatId ] ? (
              <>
                {chats[ currentChatId ]?.messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${message.role === 'user'
                      ? 'ml-auto rounded-br-none bg-white/12 text-white'
                      : 'mr-auto border-none text-white/90'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p>{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                          ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
                          ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
                          code: ({ children }) => <code className='rounded bg-white/10 px-1 py-0.5'>{children}</code>,
                          pre: ({ children }) => <pre className='mb-2 overflow-x-auto rounded-xl bg-black/30 p-3'>{children}</pre>
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className='max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base mr-auto border-none text-white/70'>
                    Thinking...
                  </div>
                )}
              </>
            ) : (
              <div className='flex h-full items-center justify-center rounded-3xl border border-dashed border-white/20 bg-[#000000]/70 p-6 text-center text-white/70'>
                <div>
                  <p className='mb-2 text-lg font-semibold text-white'>{isLoading ? 'Thinking...' : 'Start a new chat'}</p>
                  <p className='text-sm text-white/70'>{isLoading ? 'Waiting for the AI response...' : 'Click “New Chat” and send a message to begin.'}</p>
                </div>
              </div>
            )}
          </div>

          <footer className='rounded-3xl w-full absolute bottom-2 border border-white/60 bg-[#000000] p-4 md:p-5'>
            <form onSubmit={handleSubmitMessage} className='flex flex-col gap-3 md:flex-row'>
              <input
                type='text'
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder='Type your message...'
                className='w-full rounded-2xl border border-white/50 bg-transparent px-4 py-3 text-lg text-white outline-none transition placeholder:text-white/45 focus:border-white/90'
              />
              <button
                type='submit'
                disabled={!chatInput.trim()}
                className='rounded-2xl border border-[#AC6B05] bg-[#AC6B05] px-6 py-3 text-lg font-semibold text-white transition hover:bg-[#C47B1B] disabled:cursor-not-allowed disabled:opacity-50'
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard