from ..seipot.Questioner import Questioner

class QuestionerManager:
    questioners =[]

    def __init__(self):
        pass

    @staticmethod
    def extract(context:str,process,nb_task):
        inf = {}
        q  = Questioner("entreprise",[
            "quelle est le nom de l'entreprise ?"
        ])

        entr_name=q.ask(context)["answer"]
        QuestionerManager.questioners = [
            Questioner("domaine",[
                f"quelle est le domaine ou le secteur d'activité de {entr_name}?"
            ]),
            Questioner("localisation",[
                f"quelle est le lieu ou l'adresse ?"
            ]),
            Questioner("contact",[
                f"quelle est le contact?"
            ]),
            Questioner("email",[
                f"quelle est email ?"
            ]),
            Questioner("poste",[
                f"quelle est le poste ?"
            ]),
            Questioner("mission",[
                f"quelles sont vos missions ?",
            ]),
            Questioner("date_debut",[
                f"quelle est la date du début ?"
            ]),
            Questioner("competences",[
                f"quelle est le profil , compétence  recherché ?"
            ]),
            Questioner("niveau",[
                f"quelle niveau d'étude ou diplome demandé ?"
            ])

        ]
        inf[q.inf_name] = entr_name
        process.percentage += ((1/ (len(QuestionerManager.questioners) + 1)) * 100) / nb_task
        process.save()
        for questioner in QuestionerManager.questioners:
            inf[questioner.inf_name]=questioner.ask(context)["answer"]
            d=((1/(len(QuestionerManager.questioners)+1))*100)/nb_task
            print(d)
            process.percentage += d
            process.save()
        return inf