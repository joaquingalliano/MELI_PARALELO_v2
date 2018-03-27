package tallermeli

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }
        "/" (controller: "carrito", action: "error")
        "/carrito" (controller: "carrito", action: "get", method: "GET")
        "/carrito" (controller: "carrito", action: "post", method: "POST")
        "/carrito" (controller: "carrito", action: "put", method: "PUT")
        "/carrito" (controller: "carrito", action: "delete", method: "DELETE")
        //"500"(view:'/error')
        "500"(controller: "carrito", action: "error")
        "404"(view:'/notFound')
    }
}
