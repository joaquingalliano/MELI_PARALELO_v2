package tallermeli

import grails.gorm.transactions.Transactional
import groovy.json.JsonSlurper

@Transactional
class DataService {

    def Object findByApi(String urlToFind) {

        def url = new URL(urlToFind)
        def connection = (HttpURLConnection) url.openConnection()
        connection.setRequestMethod("GET")
        connection.setRequestProperty("Accept", "application/json")
        connection.setRequestProperty("User-Agent", "Mozzilla/5.0")
        JsonSlurper json = new JsonSlurper()

        def inputStream = json.parse(connection.getInputStream())
        return inputStream
    }

}
