class ImageResult {  
  img_src string @description("URL de la imagen")  
  url string @description("URL de la página fuente")  
  title string @description("Título de la imagen")  
}  
  
class VideoResult {  
  img_src string @description("URL del thumbnail")  
  url string @description("URL del video")  
  title string @description("Título del video")  
  iframe_src string @description("URL para embed")  
}  
  
class Message {  
  role string  
  content string  
}