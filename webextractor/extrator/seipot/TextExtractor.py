from ..seipot.SubExtrator import  PDFTextExtractor,DocTextExtractor, OdtTextExtrator,FileTextExtractor

class TextExtractor:
    extractors:list =  [
        PDFTextExtractor(),
        OdtTextExtrator(),
        DocTextExtractor(),
        FileTextExtractor()
    ]

    @staticmethod
    def extract(path_file: str):
        #detecter l'extension du fichier
        file_extension = path_file.split(".")[-1]
        content =""
        #appliquer l'extracteur correspondant
        for extr in TextExtractor.extractors:
            if extr.recognise(file_extension):
                content = extr.extract(path_file)
                break
        return content


if __name__=="__main__":
    ext = TextExtractor()
    #print(ext.extract("./convention.pdf"))

