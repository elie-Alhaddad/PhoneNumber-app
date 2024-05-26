using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace angulaJS.Helpers
{
    public static class DatabaseHelper
    {
        public static List<T> GetStoredProcedureItem<T>(string connectionString, string storedProcedureName, Func<SqlDataReader, T> mapper, List<SqlParameter> parameters = null)
        {
            List<T> values = new List<T>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(storedProcedureName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    if (parameters != null)
                    {
                        for (int i = 0; i < parameters.Count; i++)
                        {
                            command.Parameters.Add(parameters[i]);
                        }
                    }

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            values.Add(mapper(reader));
                        }
                    }
                }
            }

            return values;
        }

        public static bool ExecuteNonQueryStoredProcedure(string connectionString, string storedProcedureName, List<SqlParameter> parameters)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(storedProcedureName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    if (parameters != null)
                    {
                        for (int i = 0; i < parameters.Count; i++)
                        {
                            command.Parameters.Add(parameters[i]);
                        }
                    }

                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
            }
        }
    }
}
