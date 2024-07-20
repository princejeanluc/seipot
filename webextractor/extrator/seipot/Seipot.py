#Systeme d'extration d'information pertinente d'offre de travail
from ..seipot.TextExtractor import TextExtractor
from googletrans import Translator
from langdetect import detect
from ..seipot.Questioner import Questioner
from ..seipot.QuestionerManager import QuestionerManager
from ..models import Offer,ProcessExtraction
from openpyxl import Workbook
import time,os
class Seipot:
    @staticmethod
    def extract(file_path:str,process:ProcessExtraction):
        # on met une pause pour changer de thread , on quitte la thread 2 => 1
        time.sleep(0.05)
        wb = Workbook()
        ws = wb.active
        datas = [["entreprise","domaine","localisation","contact","email","poste","mission","date_debut","competences","niveau"]]
        list_text = TextExtractor.extract(file_path)
        lang = detect(list_text[0]) # on detecte la langue
        Questioner.lang = lang
        tr = Translator()
        for i in range(len(list_text)):
            list_text[i] = tr.translate(list_text[i], dest =lang).text
        process.percentage=0
        process.language = lang
        process.save()
        for text in list_text:
            inf = QuestionerManager.extract(text,process,len(list_text))
            offer = Offer(
                entreprise=inf["entreprise"],
                domaine = inf["domaine"],
                localisation= inf["localisation"],
                contact = inf["contact"],
                email = inf["email"],
                poste =  inf["poste"],
                mission = inf["mission"],
                date_debut = inf["date_debut"],
                competences = inf["competences"],
                niveau = inf["niveau"],
                process = process
            )
            data = [
            inf["entreprise"],
            inf["domaine"],
            inf["localisation"],
            inf["contact"],
            inf["email"],
            inf["poste"],
            inf["mission"],
            inf["date_debut"],
            inf["competences"],
            inf["niveau"],
            ]
            datas.append(data)
            offer.save()
        for data in datas:
            ws.append(data)
        wb.save(os.path.join("./extrator/static/documents/",process.file_name))


if __name__ =="__main__":
    print(Seipot.extract("convention.txt"))
