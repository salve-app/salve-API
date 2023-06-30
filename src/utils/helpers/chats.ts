export function getChatListWithLastMessage(chatList: Array<any>) {
	return chatList.map(({ id, provider, messages }) => ({
		id,
		provider,
		lastMessage: messages[0].message,
	}))
}
