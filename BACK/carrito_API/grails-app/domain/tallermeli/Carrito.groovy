package tallermeli

class Carrito {

    String idCarrito;
    Integer idUsuario;
    static hasMany = [items: Item]

    static constraints = {
    }

    /*

    public Carrito(ArrayList<Item> items, Integer userId) {
        this.id = UUID.randomUUID().toString();
        this.items = items;
        this.userId = userId;
    }

    public Carrito() {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Item getOneItem(String itemId){
        for (Item it : this.items){
            if(it.getId().equals(itemId)){
                return it;
            }
        }
        return null;
    }

    */


}
