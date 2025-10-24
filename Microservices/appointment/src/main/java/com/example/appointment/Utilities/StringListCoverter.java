package com.example.appointment.Utilities;

import java.util.List;

public class StringListCoverter {
    public static String coverterListToString(List<String> list){
        if(list==null || list.isEmpty()){
            return "";
        }
        return String.join(",", list);
    }

    public static List<String> coverterStringToList(String str){
        if(str==null || str.isEmpty()){
            return List.of();
        }
        return List.of(str.split(","));
    }
}