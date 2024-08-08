import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { tool } from "@langchain/core/tools";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { PythonInterpreterTool } from "langchain/experimental/tools/pyinterpreter";

import { openAIFactory } from "../factory/implementation/openai/openai";

export const pythonExecutorTool = async () => {
  const model = openAIFactory();
  const prompt = ChatPromptTemplate.fromMessages([
    new SystemMessage(`
      You're a expert in the python language, with a deep knowledge in plotting graphics based on numerous libs, such as numpy, pandas, matplotlib.
      Generate a python code that suits the user's input, test it and if it's doesn't work correctly, generate a new code that works.
      If it's necessary to plot some information, add the following command below the imports: matplotlib.use("module://matplotlib.backends.html5_canvas_backend")
    `),
    new HumanMessage('{input}')
  ]);

  const interpreter = await PythonInterpreterTool.initialize({});
  await interpreter.addPackage("numpy");
  await interpreter.addPackage("micropip");
  await interpreter.addPackage("matplotlib");

  const pythonExecutorTool = tool(
    async ({ input }) => {
      const chain = prompt
        .pipe(model)
        .pipe(interpreter)
        .pipe(new StringOutputParser());

      return chain.invoke({ input });
    },
    {
      name: 'python_executor',
      description: `Given the user's input, generate a python code and executes it.`,
      schema: z.object({
        input: z.string().describe('User input with the code generation request.')
      })
    }
  );

  return pythonExecutorTool;
};
