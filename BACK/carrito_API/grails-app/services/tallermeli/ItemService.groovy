package tallermeli

import grails.gorm.transactions.Transactional

import java.lang.reflect.Array

@Transactional
class ItemService {

    private Map<String, Item> items = new HashMap<String,Item>();

    def ArrayList<Item> setData(String idCarrito) {
        DataService dataService = new DataService()
        def url = 'http://localhost:7070/items'
        def inputStream = dataService.findByApi(url)

        //def itemReturn = []
        List<Item> itemReturn = new ArrayList<Item>()

        def contador = 0

        for(Object obj : inputStream) {
            if (contador < 2) {
                Item it = createItem(obj.item_id, 1, obj.price, obj.image, obj.title, idCarrito)
                //Item it = createItem(obj.name, 1, 15, "picture.png", obj.name, idCarrito)
                //Item it = new Item(idItem: obj.name, cantidad: "0", precio: 15, imagen: "picture.png", nombre: obj.name)
                itemReturn.add(it)

                //itemReturn << [nombre: obj.name, precio: obj.name,
                //               cantidad: obj.name, imagen: obj.name]
                contador++
            } else {
                break
            }
        }
        /*
        itemReturn << [nombre: "Item", precio: "precio",
                       cantidad: "cantidad", imagen: "imagen"]
        */
        return itemReturn
    }

    def Object getInfoItem(String itemId) {
        DataService dataService = new DataService()
        def url = 'http://localhost:7070/items/q=' + itemId
        try{
            def inputStream = dataService.findByApi(url)

            for (Object obj : inputStream) {
                return obj
            }
        }catch(Exception ex){
            return null
        }
        return null
    }

    public Item createItem(String idItem, Integer cantidad, Double precio, String imagen, String nombre, String idCarrito){
        Item it = new Item(idItem: idItem, cantidad: cantidad, precio: precio, imagen: imagen, nombre: nombre, carrito: idCarrito)
        items.put(it.idItem, it);
        return it;
    }

}
