from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.http import HttpResponse
from .forms import SaveFile
from .seipot import Seipot
from .models import ProcessExtraction
import os
import threading
from django.views.decorators.csrf import csrf_exempt

from .seipot.TextExtractor import TextExtractor


def index(request):
    form = SaveFile()
    return render(request, "index.html",{"form":form})

@csrf_exempt
def save(request):
    code = 200
    data ={}
    if request.POST.get("text","") =="":
        if request.method == "POST":
            form = SaveFile(request.POST, request.FILES)
            print(form.is_valid())
            if form.is_valid():
                file = form.cleaned_data["file"]
                v = False # verifier si le document est suporté
                for extr in TextExtractor.extractors:
                    if extr.recognise(file.name.split(".")[-1]):
                        v= True
                if not v :
                    code = 403
                    data["message"] = "fichier non supporté pour le moment"
                    return JsonResponse(data, status=code)

                path = os.path.join("./storage/",file.name)
                with open(path,'wb+') as f :
                    for chunk in file.chunks():
                        f.write(chunk)
                process = ProcessExtraction(percentage=1,file_name=file.name[:-4]+".xlsx")
                process.save()
                new_thread = threading.Thread(target=Seipot.Seipot.extract , args=(path,process,))
                new_thread.start()
                data["id_process"] = process.id
            else:
                code = 403
                data["code"] = code
                data["message"] = "le formulaire d'envoi n'est pas conforme"
        else :
            code =400
    else:
        file_name = "text.txt"
        path = os.path.join("./storage/", file_name)
        if request.method == "POST":
            with open(path, 'w', encoding="utf-8") as f:
                f.write(request.POST.get("text", ""))
            process = ProcessExtraction(percentage=1, file_name=file_name[:-4] + ".xlsx")
            process.save()
            new_thread = threading.Thread(target=Seipot.Seipot.extract, args=(path, process,))
            new_thread.start()
            data["id_process"] = process.id
        else:
            code = 403
            data["message"] = "le formulaire d'envoi n'est pas conforme"
    data["code"]=code
    return JsonResponse(data,status=code)

@csrf_exempt
def verify_process(request,process_id:int):
    process = get_object_or_404(ProcessExtraction,pk=process_id)
    data = {
        "id":process.id,
        "percentage":process.percentage,
        "language":process.language,
        "file_name":process.file_name,
        "offers":[element for element in process.offer_set.all().values()]
    }
    print(data)
    return JsonResponse(data, status=200)




