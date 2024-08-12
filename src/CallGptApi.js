import OpenAI from "openai";
const gptapikey = process.env.REACT_APP_CHAT_GPT_API_KEY;

// 以降、apiKeyを使用してAPIにアクセス

const openai = new OpenAI({
  apiKey: gptapikey,
  dangerouslyAllowBrowser: true 
});

let basicInput = ""


async function callGptApi(gpt_in) {
  if (gpt_in.transcript){
      if (gpt_in.language === 'en') {
        basicInput = "Answer shortly within 30 words. Then ask something on the topic."
      } else {
        basicInput = "30語以内で返事して。その後何か質問して。"
      }  
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `${gpt_in.transcript} ${basicInput} `,
            },
          ],
          model: "gpt-3.5-turbo",
          // 0 to 2; controls randomness: Lowering resulots in less random completions
          temperature: gpt_in.responseTemperature,
          // 1 to 4096; the maximum number of tokens to generate shared between the prompt and completion; one token is roughly 4 characters for standard English text
          max_tokens: 300,
          // 0 to 1; controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered
          top_p: 1,
          // 0 to 2; how much to penalize new tokens based on their existing frequency in the text so far; decreases the model's likelihood to repeat the same line verbatim
          frequency_penalty: 0,
          // 0 to 2; how much to penalize new tokens based on whether they appear in the text so far; increases the model's likelihood to talk about new topics
          presence_penalty: 0,
        });
    
        console.log("API Response:", completion);
    
        if (!completion.choices || completion.choices.length === 0) {
          return "No response from OPEN AI API";
        }
    
        return completion.choices[0].message.content;
      } catch (error) {
        return "Error in calling OPEN AI API";
      };
    }  else {
      return "No transcript from you";
  }
}


export default callGptApi;


