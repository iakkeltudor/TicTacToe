package com.icssizero.XandO.config;

import com.icssizero.XandO.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class DataAccessService {
    Connection con;
    private final JdbcTemplate jdbc;

    @Autowired
    public DataAccessService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
        try {
            con = jdbc.getDataSource().getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }



    public User getUserFromUsername(String username) throws SQLException {

        PreparedStatement queryString = con.prepareStatement("SELECT * FROM user WHERE user.username = ?");
        queryString.setString(1, username);

        ResultSet resultSet = queryString.executeQuery();
        List<User> users = new ArrayList<>();
        while (resultSet.next()) {
            users.add(mapUserFromResultSet(resultSet));
        }
        if (users.isEmpty())
            return null;
        return users.get(0);
    }

    private User mapUserFromResultSet(ResultSet resultSet) throws SQLException {
        User user = new User( resultSet.getInt("iduser"), resultSet.getString("username"),
                resultSet.getString("password"));
        return user;
    }

    public List<User> retrieveUsers() {
        return jdbc.query("SELECT * FROM user", new RowMapper<User>() {
            @Override
            public User mapRow(ResultSet resultSet, int rowNum) throws SQLException {
                return new User( resultSet.getInt("iduser"), resultSet.getString("username"),
                        resultSet.getString("password"));
            }
   });
    }
}

