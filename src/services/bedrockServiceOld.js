import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

export const generateWordList = async (category, difficulty) => {
  const prompt = `Generate a list of 5 ${difficulty} words related to ${category}. 
    Easy words should be 3-5 letters, medium words 6-8 letters, and hard words 9+ letters. 
    Return only the words in a comma-separated format.`;

  const params = {
    modelId: "anthropic.claude-v2",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt,
      max_tokens_to_sample: 300,
      temperature: 0.7,
    }),
  };

  try {
    const command = new InvokeModelCommand(params);
    const response = await bedrockClient.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    return result.split(',').map(word => word.trim());
  } catch (error) {
    console.error('Error generating word list:', error);
    return [];
  }
};