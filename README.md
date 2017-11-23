## Estructura del Proyecto
- src -> Contiene todos los archivos principales
  - config
    - index.js -> COntiene las variables de entorno
  - data -> contiene las class que hacen el funcionamiento de la aplicacion
    - repositories
      - **filesRepository.js** -> Class encargada de crear, modificar, eliminar y leer los archivos fisicos
      - **invoicesRepository.js** -> Class encargada obtener los datos de la API
    - **connection.js** -> Class encargada de comunicar la aplicacion con el API
    - **index.html** -> Layout de la aplicacion
    - **index.js** -> Eventos para la interaccion con la aplicacion
- **.env** -> Archivo que contiene las variables de entorno
- **.env.example** -> Archivo ejemplo de las variables de entorno
- **main.js** -> Codigo lanzador del electron


## Requisitos para el Auth de la API de Alegra.com

* Crear cuenta free [aqui](https://www.alegra.com/)
* Generar token [aqui ](https://app.alegra.com/configuration/api)

Debe crear el archivo **.env** apartir del **.env.example** en el cual debe configurar las siguientes variables:
```
EMAIL_ALEGRA=user@mail.com
TOKEN_ALEGRA=token_generado_api
URL_API=https://url_to_api
```

## Instalación

- Instalar NodeJS
- Entrar en la raiz del proyecto e instalar las dependencias con **npm install**

## Scripts

- **npm start** -> Iniciar la aplicacion
- **npm run dist** -> Generar una distribucion
- **npm run postinstall** -> Instalar dependencias
- **npm run pack /to/patch** -> Generar una distribucion en una ruta especifica
