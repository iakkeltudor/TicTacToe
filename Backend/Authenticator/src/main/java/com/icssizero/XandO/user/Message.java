package com.icssizero.XandO.user;

import lombok.Getter;

@Getter
public class Message {
    private String response;

    public Message(String s) {
        this.response = s;
    }
}
