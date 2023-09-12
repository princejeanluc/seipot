from django import forms

class SaveFile(forms.Form):
    file = forms.FileField()