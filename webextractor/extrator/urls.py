from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("save/", views.save, name="save"),
    path("check/<int:process_id>",views.verify_process,name="check")
]