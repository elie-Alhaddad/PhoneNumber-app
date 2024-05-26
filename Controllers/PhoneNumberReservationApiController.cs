using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;
using angulaJS.Models;

namespace angulaJS.Controllers.API
{
    [RoutePrefix("api/PhoneNumberReservation")]
    public class PhoneNumberReservationApiController : ApiController
    {
        private readonly string connectionString = "Data Source=DESKTOP-2E2FSVM;Initial Catalog=InternProject;Integrated Security=True;";

        [HttpGet]
        [Route("GetPhoneNumberReservations")]
        public IHttpActionResult GetPhoneNumberReservations()
        {
            List<PhoneNumberReservation> reservations = new List<PhoneNumberReservation>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("GetPhoneNumberReservation", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        PhoneNumberReservation reservation = MapPhoneNumberReservation(reader);
                        reservations.Add(reservation);
                    }
                }
            }

            return Ok(reservations);
        }

        [HttpGet]
        [Route("GetFilteredPhoneNumberReservations")]
        public IHttpActionResult GetFilteredPhoneNumberReservations(string clientFilter, string phoneNumberFilter)
        {
            List<PhoneNumberReservation> reservations = new List<PhoneNumberReservation>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("GetFilteredPhoneNumberReservations", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ClientFilter", $"%{clientFilter}%");
                    command.Parameters.AddWithValue("@PhoneNumberFilter", $"%{phoneNumberFilter}%");

                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        PhoneNumberReservation reservation = MapPhoneNumberReservation(reader);
                        reservations.Add(reservation);
                    }
                }
            }

            return Ok(reservations);
        }

        [HttpPost]
        [Route("SavePhoneNumberReservation")]
        public IHttpActionResult SavePhoneNumberReservation(PhoneNumberReservation reservation)
        {
            if (reservation == null)
            {
                return BadRequest("Invalid phone number reservation data.");
            }

            // Set the BeginEffectiveDate as the current datetime from the server
            reservation.BeginEffectiveDate = DateTime.Now;
           


            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("SavePhoneNumberReservation", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ClientId", reservation.ClientId);
                    command.Parameters.AddWithValue("@PhoneNumberId", reservation.PhoneNumberId);
                    command.Parameters.AddWithValue("@BeginEffectiveDate", reservation.BeginEffectiveDate);
                    command.Parameters.AddWithValue("@EndEffectiveDate", reservation.EndEffectiveDate);

                    try
                    {
                        int rowsAffected = command.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(reservation);
                        }
                        else
                        {
                            return InternalServerError(new Exception("Failed to save phone number reservation."));
                        }
                    }
                    catch (SqlException ex)
                    {
                        // Handle the foreign key constraint violation gracefully
                        if (ex.Number == 547) // Foreign key violation error number
                        {
                            return BadRequest("Invalid ClientId or PhoneNumberId. Please check if the provided ClientId and PhoneNumberId exist in the database.");
                        }
                        else
                        {
                            return InternalServerError(ex);
                        }
                    }
                }
            }
        }

      [HttpPost]
[Route("UnreservePhoneNumber")]
public IHttpActionResult UnreservePhoneNumber(PhoneNumberReservation reservation)
{
    using (SqlConnection connection = new SqlConnection(connectionString))
    {
        connection.Open(); 

                // Set the EndEffectiveDate to the current date and time
                reservation.EndEffectiveDate = DateTime.Now;

                using (SqlCommand command = new SqlCommand("UnreservePhoneNumber", connection))
        {
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@ClientId", reservation.ClientId);
            command.Parameters.AddWithValue("@EndEffectiveDate", reservation.EndEffectiveDate);

            try
            {
                int rowsAffected = command.ExecuteNonQuery();

                if (rowsAffected > 0)
                {
                    return Ok("Reservation successfully unreserved.");
                }
                else
                {
                    return NotFound(); // Return 404 if the reservation is not active
                }
            }
            catch (SqlException ex)
            {
                // Handle the exception, if needed
                return InternalServerError(ex);
            }
        }
    }
}








        private PhoneNumberReservation MapPhoneNumberReservation(SqlDataReader reader)
        {
            PhoneNumberReservation reservation = new PhoneNumberReservation
            {
                Id = (int)reader["Id"],
                ClientId = (int)reader["ClientId"],
                PhoneNumberId = (int)reader["PhoneNumberId"],
                BeginEffectiveDate = (DateTime)reader["BED"],
                EndEffectiveDate = reader["EED"] != DBNull.Value ? (DateTime?)reader["EED"] : null,
                // Navigation properties are not populated here, as they are not used in this API
            };

            // Add the client name and phone number properties to the reservation object
            reservation.Client = new Client
            {
                // Assuming the client name column is named "Name" in the Client table
                Name = (string)reader["ClientName"]
            };

            reservation.PhoneNumber = new PhoneNumber
            {
                // Assuming the phone number column is named "Number" in the PhoneNumber table
                Number = (string)reader["PhoneNumber"]
            };

            return reservation;
        }
    }
}
