package tallermeli

class CarritoController {

    CarritoService carritoService = new CarritoService()
    ItemService itemService = new ItemService()
    UserService userService = new UserService()

    static allowedMethods = [get: "GET", post: "POST", put: "PUT", delete: "DELETE"]

    def get() {
        //pido usuario por params
        def idUsuarioParams = params.int('idUsuario')
        if(idUsuarioParams == null){
            def res = []
            render res as grails.converters.JSON
        } else {

            def carrito = []
            carrito = carritoService.getMethod(idUsuarioParams)
            render carrito as grails.converters.JSON
        }
    }

    //Este PUT es para modificar la cantidad de un item
    def put() {
        //pido usuario por params (se pide siempre, porque qel carrito depende del usuario)
        def idUsuarioParams = params.int('idUsuario')
        def idItem = params.idItem
        def cantidad = params.int('cantidad')

        carritoService.putMethod(idUsuarioParams, idItem, cantidad)

        def carrito = []
        carrito = carritoService.getMethod(idUsuarioParams)
        render carrito as grails.converters.JSON
    }

    //El POST es para agregar un item al carrito de un usuario
    def post() {
        //pido usuario por params (se pide siempre, porque qel carrito depende del usuario)
        def idUsuarioParams = params.int('idUsuario')
        def idItem = params.idItem

        if(idUsuarioParams == null){
            def res = []
            render res as grails.converters.JSON
        } else {

            carritoService.postMethod(idUsuarioParams, idItem)

            def carrito = []
            carrito = carritoService.getMethod(idUsuarioParams)
            render carrito as grails.converters.JSON
        }
    }

    def delete() {
        //pido usuario por params (se pide siempre, porque qel carrito depende del usuario)
        def idUsuarioParams = params.int('idUsuario')
        def idItem = params.idItem

        if(idUsuarioParams == null){
            def res = []
            render res as grails.converters.JSON
        } else {

            carritoService.deleteMethod(idUsuarioParams, idItem)

            def carrito = []
            carrito = carritoService.getMethod(idUsuarioParams)
            render carrito as grails.converters.JSON
        }
    }

    def error() {
        def error = []
        error << [carrito: null, puntos: null, idUsuario: null]
        render error as grails.converters.JSON
    }



}
