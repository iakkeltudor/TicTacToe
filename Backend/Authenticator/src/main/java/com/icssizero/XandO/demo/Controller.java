package com.icssizero.XandO.demo;

import com.icssizero.XandO.config.DataAccessService;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.crypto.Data;

@RestController
@RequestMapping("/api/v1/demoController")
public class Controller {

    DataAccessService dataAccessService;

    public Controller(DataAccessService dataAccessService) { this.dataAccessService = dataAccessService;}


    @GetMapping
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello from secured endpoint!!");
    }
}
