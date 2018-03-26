package tallermeli

import grails.gorm.transactions.Transactional

@Transactional
class UserService {

    def Integer getCuponesUsuario(Integer idUsuario) {
        DataService dataService = new DataService()
        def url = 'http://localhost:7070/users/q=' + idUsuario
        try{
            def inputStream = dataService.findByApi(url)

            def cupones = inputStream.cupons[0]
            if (cupones == null) {
                cupones = 0
            }
            return cupones
        }catch(Exception ex){
            return 0
        }
    }
}
