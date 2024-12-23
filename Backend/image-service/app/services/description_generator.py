import os
import google.generativeai as genai

class GeminiLLM:

    def _load_model(self):
        self.safe = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE",
            },
        ]

        self.model = genai.GenerativeModel(
            model_name=self.GEMINI_MODEL_NAME,
            generation_config=self.generation_config,
            safety_settings=self.safe
        )


    def __init__(self):
        self.GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
        self.GEMINI_MODEL_NAME = os.getenv('GEMINI_MODEL_NAME')
        
        genai.configure(api_key=self.GEMINI_API_KEY)
        
        self.generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }
        self._load_model()


    def run(self, pokemon:str, uuid:str):
        print("Generating prompt for pokemon")
        prompt = (
            f"Describe Pokemon {pokemon} in detail for a prompt to my image model to draw, including its physical appearance and any unique features that make it stand out. It should be in simple english. Note: It is going to be an input to AI model, so optimize the prompt on that basis"
            f"Tell the model to embed the unique id in the image : {uuid}"
            f"Also add few extra description which would be unique to uuid. Like details of the pokemon different which would add huge randomness"
            "Your response should be in plain/text. Don't use special characters."
        )
        
        try:
            response = self.model.generate_content(prompt)
            print(f"Generated prompt : {response.text}")
            return response.text
        except Exception as e:
            return f"An error occurred: {str(e)}"
