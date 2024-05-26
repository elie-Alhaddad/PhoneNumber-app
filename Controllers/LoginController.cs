using angulaJS.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;

[RoutePrefix("api/users")]
public class UserController : ApiController
{
    private readonly string connectionString = "Data Source=DESKTOP-2E2FSVM;Initial Catalog=InternProject;Integrated Security=True;";

    [HttpGet]
    [Route("")]
    public IHttpActionResult GetAllUsers()
    {
        List<User> users = new List<User>();

        using (var connection = new SqlConnection(connectionString))
        {
            connection.Open();

            using (var command = new SqlCommand("GetAllUsers", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        users.Add(new User
                        {
                            Id = Convert.ToInt32(reader["Id"]),
                            Username = Convert.ToString(reader["Username"]),
                            Password = Convert.ToString(reader["Password"])
                        });
                    }
                }
            }
        }

        return Ok(users);
    }
}
