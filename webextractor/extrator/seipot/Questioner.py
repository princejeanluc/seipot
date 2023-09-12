from transformers import pipeline
from googletrans import Translator

model_name = "deepset/roberta-base-squad2"
nlp = pipeline("question-answering" , model = model_name, tokenizer=model_name)

class Questioner :
    lang = "fr"
    tr = Translator() # traducteur pour gerer les différentes langues
    def __init__(self, inf_name :str , questions:list):
        self.inf_name = inf_name
        self.questions = questions

    def ask(self, context:str):
        answers = []
        for question in self.questions :
            answer = nlp(
                {
                    "context":str(context),
                    "question":str(Questioner.tr.translate(question, dest=Questioner.lang).text)
                }
            )
            print(str(Questioner.tr.translate(question, dest=Questioner.lang)))
            print(answer)
            answers.append(answer)

        high_prob_ans = answers[0]
        for answer in answers[1:]:
            if answer['score'] > high_prob_ans['score']:
                high_prob_ans = answer
        return high_prob_ans
