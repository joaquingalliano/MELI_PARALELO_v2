package tallermeli

class Item {

    String idItem;
    String nombre;
    Double precio;
    String imagen;
    Integer cantidad;

    /*
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getJsonData() {
        return jsonData;
    }

    public void setJsonData(String jsonData) {
        this.jsonData = jsonData;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Item(String id, Integer cantidad) {
        this.id = id;
        this.cantidad = cantidad;
    }
    */

    static belongsTo = [carrito: Carrito]

    static constraints = {
    }
}
