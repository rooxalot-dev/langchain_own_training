import 'dotenv/config';
import readline from 'readline';
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages';

import { getChatbotAgent } from './agents/chatbot.agent';

(async () => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const chatbotAgentExecutor = await getChatbotAgent();
  const chatHistory: BaseMessage[] = [];

  const runChatbot = async () => {
    rl.question('Human: ', async (userInput: string) => {
      try {
        if (chatbotAgentExecutor === null || userInput.toLowerCase() === 'exit') {
          rl.close();
          return;
        }

        const humanMessage = new HumanMessage(userInput);
        console.log(`Human: ${humanMessage.content}`);

        const response = await chatbotAgentExecutor.invoke({ input: userInput, chat_history: chatHistory });
        const aiMessage = new AIMessage(response.output);
        console.log(`IA: ${aiMessage.content}`);

        chatHistory.push(humanMessage);
        chatHistory.push(aiMessage);

        runChatbot();
      } catch (error) {
        console.log('Error in chatbot: ', error);
        rl.close();
        return;
      }
    });
  }

  runChatbot();
})();
