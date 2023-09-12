from django.db import models

class ProcessExtraction(models.Model):
    percentage = models.IntegerField()
    file_name = models.CharField(max_length=200)
    language = models.CharField(max_length=100,default="")

    def __str__(self):
        return f"process {self.id} : {self.percentage} %"


class Offer(models.Model):
    entreprise = models.CharField(max_length=200)
    domaine = models.CharField(max_length=200)
    localisation = models.CharField(max_length=200)
    contact = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    poste = models.CharField(max_length=200)
    mission = models.CharField(max_length=200)
    date_debut = models.CharField(max_length=200)
    competences = models.CharField(max_length=200)
    niveau = models.CharField(max_length=200)
    process =models.ForeignKey(ProcessExtraction, on_delete=models.CASCADE)

    def __str__(self):
        return f"entreprise : {self.entreprise} \n domaine : {self.domaine} \n localisation :{self.localisation} \n email :{self.email}"

