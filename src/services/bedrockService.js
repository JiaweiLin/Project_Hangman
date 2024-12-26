// Import required AWS SDK modules
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { secret } from '@aws-amplify/backend';

// Initialize the Bedrock client
const bedrockClient = new BedrockRuntimeClient({
    credentials: {
        accessKeyId: secret('REACT_APP_API_KEY'),
        secretAccessKey: secret('REACT_APP_ACCESS_KEY')
      },
    region: "ap-southeast-1" // Replace with your preferred region
});

/**
 * Generates words for a given category using Amazon Bedrock
 * @param {string} category - The category to generate words for
 * @returns {Promise<string[]>} Array of generated words
 */
export async function generateWordList(category, difficultySelect) {
    const prompt = `Generate 6 unique, single-word ${category} that would be good for a game of Hangman. 
        The words should be of difficulty ${difficultySelect}. 
        Format the response as a JSON array of uppercase strings.
        For example: ["WORD1", "WORD2", "WORD3", "WORD4", "WORD5", "WORD6"]`;

    const params = {
        modelId: "apac.anthropic.claude-3-sonnet-20240229-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 100,
            temperature: 0.7,
            top_p: 0.9,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        })
    };

    try {
        const command = new InvokeModelCommand(params);
        const response = await bedrockClient.send(command);
        
        // Parse the response
        const responseText = new TextDecoder().decode(response.body);
        const responseJson = JSON.parse(responseText);
        
        // Extract the array of words from the response
        const content = responseJson.content[0].text;
        // Find the array pattern in the text response
        const arrayMatch = content.match(/\[.*\]/);
        if (!arrayMatch) {
            throw new Error("Could not find array in response");
        }
        
        let words = JSON.parse(arrayMatch[0]);
        
        // Validate the response
        if (!Array.isArray(words) || words.length !== 6) {
            throw new Error("Invalid response format from Bedrock");
        }
        
        return words.map(word => word.toUpperCase());
    } catch (error) {
        console.error("Error generating words with Bedrock:", error);
        // Fallback to default words if there's an error
        return getDefaultWords(category);
    }
}

/**
 * Returns default words for a category in case of API failure
 * @param {string} category - The category to get default words for
 * @returns {string[]} Array of default words
 */
function getDefaultWords(category) {
    const defaultWords = {
        animals: ['ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'KANGAROO'],
        countries: ['BRAZIL', 'JAPAN', 'FRANCE', 'CANADA', 'EGYPT'],
        food: ['PIZZA', 'SUSHI', 'BURGER', 'PASTA', 'TACOS'],
        colors: ['PURPLE', 'ORANGE', 'INDIGO', 'MAROON', 'SILVER'],
        cities: ['LONDON', 'TOKYO', 'PARIS', 'SYDNEY', 'MADRID'],
        sports: ['TENNIS', 'SOCCER', 'HOCKEY', 'BOXING', 'RUGBY'],
        music: ['JAZZ', 'BLUES', 'METAL', 'REGGAE', 'DISCO'],
        scifi: ['ROBOT', 'ALIEN', 'LASER', 'CLONE', 'SPACE'],
        fantasy: ['DRAGON', 'WIZARD', 'MAGIC', 'SWORD', 'QUEST'],
        history: ['EGYPT', 'ROME', 'AZTEC', 'VIKING', 'SPARTA']
    };
    return defaultWords[category] || defaultWords.animals;
}
