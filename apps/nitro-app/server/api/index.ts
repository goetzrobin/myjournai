import {ChatOpenAI} from "@langchain/openai";
import {eventHandler} from "h3";
import {useRuntimeConfig} from "nitropack/runtime";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import {AIMessage, BaseMessage, HumanMessage} from "@langchain/core/messages";
import {END, MemorySaver, MessageGraph, START} from "@langchain/langgraph";


export default eventHandler(async (event) => {
    console.log(event.context.user)
    const res = event.node.res;

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
    });

    const sendData = (data: any) => {
        res.write(`data: ${JSON.stringify({data})}\n\n`);
    };


    const {openApiKey} = useRuntimeConfig(event)
    const llm = new ChatOpenAI({temperature: 0, apiKey: openApiKey});

    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            `You are an essay assistant tasked with writing excellent 5-paragraph essays.
Generate the best essay possible for the user's request.  
If the user provides critique, respond with a revised version of your previous attempts.`,
        ],
        new MessagesPlaceholder("messages"),
    ]);
    const essayGenerationChain = prompt.pipe(llm);

    const reflectionPrompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            `You are a teacher grading an essay submission.
Generate critique and recommendations for the user's submission.
Provide detailed recommendations, including requests for length, depth, style, etc.`,
        ],
        new MessagesPlaceholder("messages"),
    ]);
    const reflect = reflectionPrompt.pipe(llm);

    const generationNode = async (messages: BaseMessage[]) => {
        return [await essayGenerationChain.invoke({messages})];
    };
    const reflectionNode = async (messages: BaseMessage[]) => {
        // Other messages we need to adjust
        const clsMap: { [key: string]: new (content: string) => BaseMessage } = {
            ai: HumanMessage,
            human: AIMessage,
        };
        // First message is the original user request. We hold it the same for all nodes
        const translated = [
            messages[0],
            ...messages
                .slice(1)
                .map((msg) => new clsMap[msg._getType()](msg.content.toString())),
        ];
        const res = await reflect.invoke({messages: translated});
        // We treat the output of this as human feedback for the generator
        return [new HumanMessage({content: res.content})];
    };
    const streamFinalMessageNode = async (messages: BaseMessage[]) => {
        const finalStream = await essayGenerationChain.stream({messages});
        sendData("[START]");
        try {
            for await (const chunk of finalStream) {
                console.log('sending chunk', chunk.content)
                sendData(chunk.content)
            }
        } catch (err) {
            console.error(err);
            // Ignore error
        } finally {
            sendData("[DONE]");
            res.end();
        }
        return messages;
    }

    const shouldContinue = (messages: BaseMessage[]) => {
        if (messages.length > 3) {
            return 'stream-final';
        }
        return "reflect";
    };

    // Define the graph
    const workflow = new MessageGraph()
        .addNode("generate", generationNode)
        .addNode("reflect", reflectionNode)
        .addNode("stream-final", streamFinalMessageNode)
        .addEdge(START, "generate")
        .addConditionalEdges("generate", shouldContinue)
        .addEdge("reflect", "generate")
        .addEdge("reflect", 'stream-final')
        .addEdge('stream-final', END)
    ;

    const app = workflow.compile({checkpointer: new MemorySaver()});

    const checkpointConfig = {configurable: {thread_id: "my-thread"}};

    await app.invoke(
        [
            new HumanMessage({
                content:
                    "Generate an essay on the topicality of The Little Prince and its message in modern life",
            }),
        ],
        checkpointConfig,
    );

    console.log(await app.getState(checkpointConfig))

});
