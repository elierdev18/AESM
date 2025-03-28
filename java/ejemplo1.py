class Estudiante:
    codigo=0
    nombre=""
    apellido=""
    
    
    def imprimir_Datos (self,codigo,nombre,apellido):
      print(self.codigo,self.nombre,self.apellido)


#crear obejto adso
adso=Estudiante()


adso.codigo =1
adso.nombre ="SANDRA"
adso.apellido ="CRUZ"
adso.importar_Datos()