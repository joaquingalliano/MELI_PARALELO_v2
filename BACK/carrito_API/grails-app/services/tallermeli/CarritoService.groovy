package tallermeli

import grails.gorm.transactions.Transactional

@Transactional
class CarritoService {

    UserService userService
    ItemService itemService

    private Map<String, Carrito> carritos = new HashMap<String,Carrito>();

    /********************************************************************/
    public ArrayList getMethod(Integer idUsuarioParams) {

        //por carritoSercive me fijo si ya existe un carrito para el usuario
        Carrito carrito = getCarritoByUser(idUsuarioParams)

        //armo el json
        def carritoJson = []
        def idUsuario = idUsuarioParams
        def itemsCarrito = carrito.items
        def cupones = userService.getCuponesUsuario(idUsuarioParams)

        carritoJson << [carrito: itemsCarrito, cupones: cupones, idUsuario: idUsuarioParams]
        return carritoJson
    }

    //obtengo un carrito por idUsuario, si no tiene, devuelve null
    public Carrito getCarritoByUser(Integer userId){
        //ItemService itemService = new ItemService()
        Carrito carritoUser
        List<Carrito> lista = getAllCarritos()

        //eCarrito.findAllByIdUsuario()

        for(Carrito carrito : lista){
            if(carrito.idUsuario == userId){
                carritoUser = carrito;
            }
        }
        if (carritoUser == null) {
            //si no existe el carrito, lo creo (a traves del servicio)
            List<Item> listaItem = new ArrayList<Item>()
            carritoUser = createCarrito(userId, listaItem)

            //seteo unos datos de prueba en forma de List<Item>
            //carritoUser.items = itemService.setData(carritoUser.idCarrito)
        }
        return carritoUser;
    }

    //obtengo todos los carritos registrados en la api
    public List<Carrito> getAllCarritos(){
        //return Carrito.all
        return new ArrayList<Carrito>(carritos.values());
    }

    //agrego un carrito a la api (carritoService)
    public Carrito createCarrito(Integer userId, List<Item> items){
        //failIfInvalid(name, img);
        Carrito carrito = new Carrito(idCarrito: UUID.randomUUID().toString(),  idUsuario: userId, items: items)
        //guarda en la base de grails
        //carrito.save()
        carritos.put(carrito.idCarrito, carrito);
        return carrito;
    }

    /********************************************************************/
    public Carrito putMethod(Integer idUsuarioParams, String idItem, Integer nuevaCantidad) {
        UserService userService = new UserService()

        //por carritoService me fijo si ya existe un carrito para el usuario
        Carrito carrito = getCarritoByUser(idUsuarioParams)
        //System.out.println(carrito.items.getAt(idItem))
        //busco el item a modificar por su id
        for (Item it : carrito.items) {
            if (it.idItem.equals(idItem)) {
                it.cantidad = nuevaCantidad
                break;
            }
        }

        carritos.put(carrito.idCarrito, carrito);
        //Carrito car = new Carrito()
        //carrito.save()


        //carritos
        return carrito
    }

    /********************************************************************/
    public Carrito deleteMethod(Integer idUsuarioParams, String idItem) {
        UserService userService = new UserService()

        //por carritoService me fijo si ya existe un carrito para el usuario
        Carrito carrito = getCarritoByUser(idUsuarioParams)

        List<Item> lista = carrito.items.asList()
        //busco el item a modificar por su id
        for (Item it : carrito.items) {
            if (it.idItem.equals(idItem)) {
                lista.remove(it)
            }
        }
        carrito.items = lista
        carritos.put(carrito.idCarrito, carrito)
        return carrito
    }

    /********************************************************************/
    public Carrito postMethod(Integer idUsuarioParams, String idItem) {
        UserService userService = new UserService()

        //por carritoService me fijo si ya existe un carrito para el usuario
        Carrito carrito = getCarritoByUser(idUsuarioParams)

        List<Item> lista = carrito.items.asList()
        //busco el item a modificar por su id
        def flag = false
        for (Item it : lista) {
            if (it.idItem.equals(idItem)) {
                flag = true
                break
            }
        }
        if (flag) {
            //no agrego el item
        } else {
            Object itemDetail = itemService.getInfoItem(idItem)
            if (itemDetail == null){

            } else {
                Item itemNuevo = itemService.createItem(itemDetail.item_id, 1, Double.parseDouble(itemDetail.price), itemDetail.image, itemDetail.title, carrito.idCarrito)
                lista.add(itemNuevo)
                carrito.items = lista
                carritos.put(carrito.idCarrito, carrito)
            }
        }
        return carrito
    }



    public Carrito getCarrito(String id) {
        return carritos.get(id);
    }


    /*
    private void failIfInvalid(String name, String img) throws IllegalArgumentException{
        if ( (name == null || name.isEmpty()) || (img == null || img.isEmpty() )){
            throw new IllegalArgumentException("Debe completar todos los campos");
        }
    }
    */

    public Carrito updateCarritoByIdCarrito(String idCarrito, ArrayList<Item> items){
        //failIfInvalid(name, img);
        List<Carrito> listaCompleta = getAllCarritos();
        Carrito updatedCarrito = new Carrito();
        for (Carrito car : listaCompleta){
            if(car.getId().equals(idCarrito)){
                car.setItems(items);
                break;
            }
        }
        return updatedCarrito;
    }

    public Carrito updateCarritoByUserId(ArrayList<Item> items, Integer userId){
        //failIfInvalid(name, img);
        List<Carrito> listaCompleta = getAllCarritos();
        Carrito updatedCarrito = new Carrito();
        for (Carrito car : listaCompleta){
            if(car.getUserId() == userId){
                car.setItems(items);
                break;
            }
        }
        return updatedCarrito;
    }

    /*
    public Carrito agregarItemCarritoByUser(Integer userId, Item item){
        Carrito car = getCarritoByUser(userId);
        car.addOneItem(item);
        return car;
    }
    */

    public Carrito agregarItemCarritoByUser(String userIdParam, String itemIdParam){
        Integer userId = Integer.parseInt(userIdParam);
        Carrito car = getCarritoByUser(userId);

        //consulto la data del item que me mandaron
        //obtenerItemById

        //creo mi item
        //Item item = new Item();

        //agrego item al carrito
        //car.addOneItem(item);
        return car;
    }


    def obtenerItemById(String direccion){

        DataService dataService = new DataService()

        def url = 'https://api.mercadolibre.com/sites/MLA/categories'
        def inputStream = dataService.findByApi(url)

        System.out.println(inputStream);

        /*
        def lat = inputStream.results.geometry.location.lat
        def lng = inputStream.results.geometry.location.lng
        //obtengo el valor de cada uno
        def latitud = lat[0]
        def longitud = lng[0]
        return [latitud, longitud]
        */
    }

    public Carrito modificarCantidadItemByUser(Integer userId, String itemId, Integer nuevaCantidad){
        Carrito car = getCarritoByUser(userId);
        Item it = car.getOneItem(itemId);
        it.setCantidad(nuevaCantidad);
        return car;
    }

    public Carrito deleteCarrito(String id){
        //failIfNotExist(id);
        Carrito carrito = getCarrito(id);
        carritos.remove(carrito.getId(), carrito);
        return carrito;
    }

    /*
    private void failIfNotExist(String id) throws IndexOutOfBoundsException{
        List<Category> listaCategorias = getAllCategories();
        Category category = getCategory(id);
        if(!listaCategorias.contains(category)){
            throw new IndexOutOfBoundsException("La categoría no existe");
        }
    }
    */






}
