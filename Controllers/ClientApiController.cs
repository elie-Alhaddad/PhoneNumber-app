using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;
using angulaJS.Models;





namespace angulaJS.Controllers.API
{
    [RoutePrefix("api/Client")]
    public class ClientApiController : ApiController
    {
        private readonly string connectionString = "Data Source=DESKTOP-2E2FSVM;Initial Catalog=InternProject;Integrated Security=True;";

        [HttpGet]
        [Route("GetAllClients")]
        public IHttpActionResult GetAllClients()
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("GetAllClients", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    SqlDataReader reader = command.ExecuteReader();
                    List<Client> clients = new List<Client>();

                    while (reader.Read())
                    {
                        Client client = new Client
                        {
                            Id = (int)reader["Id"],
                            Name = (string)reader["Name"],
                            Type = GetClientType(reader["Type"]),
                            BirthDate = reader["BirthDate"] == DBNull.Value ? null : (DateTime?)reader["BirthDate"]
                        };

                        client.TypeName = GetClientTypeName(client.Type); // Set the TypeName property

                        clients.Add(client);
                    }

                    return Ok(clients);
                }
            }
        }


        [HttpGet]
        [Route("GetFilteredClients")]
        public IHttpActionResult GetFilteredClients(string nameFilter, string typeFilter)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("GetFilteredClients", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@NameFilter", nameFilter ?? string.Empty);
                    command.Parameters.AddWithValue("@TypeFilter", typeFilter ?? string.Empty);

                    SqlDataReader reader = command.ExecuteReader();
                    List<Client> clients = new List<Client>();

                    while (reader.Read())
                    {
                        Client client = new Client
                        {
                            Id = (int)reader["Id"],
                            Name = (string)reader["Name"],
                            Type = GetClientType(reader["Type"]),
                            BirthDate = reader["BirthDate"] == DBNull.Value ? null : (DateTime?)reader["BirthDate"]
                        };

                        client.TypeName = GetClientTypeName(client.Type);
                        clients.Add(client);
                    }

                    return Ok(clients);
                }
            }
        }


        [HttpPost]
        [Route("AddClient")]
        public IHttpActionResult AddClient(Client client)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("AddClient", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Name", client.Name);
                    command.Parameters.AddWithValue("@Type", client.Type.ToString());
                    command.Parameters.AddWithValue("@BirthDate", client.BirthDate?.ToString("yyyy-MM-dd") ?? (object)DBNull.Value);

                    command.ExecuteNonQuery();

                    client.TypeName = GetClientTypeName(client.Type); // Set the TypeName property

                    return Ok(client);
                }
            }
        }

        [HttpPost]
        [Route("UpdateClient")]
        public IHttpActionResult UpdateClient(Client client)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("UpdateClient", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Id", client.Id);
                    command.Parameters.AddWithValue("@Name", client.Name);
                    command.Parameters.AddWithValue("@Type", client.Type.ToString());
                    command.Parameters.AddWithValue("@BirthDate", client.BirthDate?.ToString("yyyy-MM-dd") ?? (object)DBNull.Value);

                    command.ExecuteNonQuery();

                    client.TypeName = GetClientTypeName(client.Type); // Set the TypeName property

                    return Ok(client);
                }
            }
        }

        [HttpGet]
        [Route("GetClientsCountByType")]
        public IHttpActionResult GetClientsCountByType(string TypeFilter = null)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("GetClientsCountByType", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Add the @TypeFilter parameter to the stored procedure
                    command.Parameters.AddWithValue("@TypeFilter", TypeFilter);

                    SqlDataReader reader = command.ExecuteReader();
                    List<ClientReportData> clientsCountByType = new List<ClientReportData>();

                    while (reader.Read())
                    {
                        ClientReportData clientReportData = new ClientReportData
                        {
                            Type = GetClientType(reader["Type"]),
                            NumberOfClients = Convert.ToInt32(reader["NumberOfClients"])
                        };

                        clientReportData.TypeName = GetClientTypeName(clientReportData.Type);
                        clientsCountByType.Add(clientReportData);
                    }

                    return Ok(clientsCountByType);
                }
            }
        }




        private ClientType GetClientType(object typeValue)
        {
            if (typeValue == DBNull.Value || typeValue == null || string.IsNullOrWhiteSpace(typeValue.ToString()))
                return ClientType.Individual;

            if (Enum.TryParse<ClientType>(typeValue.ToString(), out var clientType))
                return clientType;

            return ClientType.Individual;
        }

        private string GetClientTypeName(ClientType type)
        {
            if (type == ClientType.Individual)
                return "Individual";
            else if (type == ClientType.Organization)
                return "Organization";
            else
                return "";
        }
    }
}
