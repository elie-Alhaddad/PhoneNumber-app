using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;
using angulaJS.Helpers;
using angulaJS.Models;

namespace angulaJS.Controllers.API
{
    [RoutePrefix("api/PhoneNumber")]
    public class PhoneNumberApiController : ApiController
    {
        private readonly string connectionString = "Data Source=DESKTOP-2E2FSVM;Initial Catalog=InternProject;Integrated Security=True;";

        // Get all phone numbers
        [HttpGet]
        [Route("GetAllPhoneNumbersWithDeviceName")]
        public IHttpActionResult GetAllPhoneNumbersWithDeviceName()
        {
            List<PhoneNumber> phoneNumbers = DatabaseHelper.GetStoredProcedureItem(connectionString, "GetAllPhoneNumbersWithDeviceName", MapPhoneNumber);

            return Ok(phoneNumbers);
        }

        private PhoneNumber MapPhoneNumber(SqlDataReader reader)
        {
            PhoneNumber phoneNumber = new PhoneNumber
            {
                Id = (int)reader["Id"],
                Number = (string)reader["Number"],
                Device = new Device
                {
                    Name = (string)reader["DeviceName"]
                }
            };

            return phoneNumber;
        }




        // Add a new phone number
        [HttpPost]
        [Route("AddPhoneNumber")]
        public IHttpActionResult AddPhoneNumber(PhoneNumber phoneNumber)
        {
            List<SqlParameter> parameters = new List<SqlParameter>
            {
                new SqlParameter("@Number", phoneNumber.Number),
                new SqlParameter("@DeviceId", phoneNumber.DeviceId)
            };

            int phoneNumberId = DatabaseHelper.GetStoredProcedureItem(connectionString, "AddPhoneNumber", MapPhoneNumberId, parameters).FirstOrDefault();

            return Ok(phoneNumberId);
        }

        private int MapPhoneNumberId(SqlDataReader reader)
        {
            if (reader.Read())
            {
                return reader.GetInt32(0);
            }

            return 0;
        }

        // Update a phone number
        [HttpPost]
        [Route("UpdatePhoneNumber")]
        public IHttpActionResult UpdatePhoneNumber(PhoneNumber phoneNumber)
        {
            if (phoneNumber == null)
            {
                return BadRequest("Invalid phone number data.");
            }

            if (phoneNumber.Device == null)
            {
                return BadRequest("Phone number device is not specified.");
            }

            List<SqlParameter> parameters = new List<SqlParameter>
    {
        new SqlParameter("@PhoneNumberId", phoneNumber.Id),
        new SqlParameter("@PhoneNumber", phoneNumber.Number),
        new SqlParameter("@DeviceId", phoneNumber.Device.Id)
    };

            bool isUpdated = DatabaseHelper.ExecuteNonQueryStoredProcedure(connectionString, "UpdatePhoneNumber", parameters);

            return isUpdated ? (IHttpActionResult)Ok(true) : NotFound();

        }





        // Filter the phone numbers based on number and device name
        [HttpGet]
        [Route("GetFilteredPhoneNumbers")]
        public IHttpActionResult GetFilteredPhoneNumbers(string numberFilter, string deviceFilter)
        {
            List<SqlParameter> parameters = new List<SqlParameter>
    {
        new SqlParameter("@NumberFilter", $"%{numberFilter}%"),
        new SqlParameter("@DeviceFilter", $"%{deviceFilter}%")
    };

            List<PhoneNumber> phoneNumbers = DatabaseHelper.GetStoredProcedureItem(connectionString, "GetFilteredPhoneNumbers", MapPhoneNumber, parameters);

            return Ok(phoneNumbers);
        }



        // Add the stored procedure to get reserved and unreserved phone numbers per device
        [HttpGet]
        [Route("GetReservedUnreservedPhoneNumbersPerDevice")]
        public IHttpActionResult GetReservedUnreservedPhoneNumbersPerDevice(string deviceName = null, string phoneNumberStatus = null)
        {
            List<SqlParameter> parameters = new List<SqlParameter>
    {
        new SqlParameter("@DeviceName", deviceName),
        new SqlParameter("@PhoneNumberStatus", phoneNumberStatus)
    };

            List<PhoneNumberReport> phoneNumbersReport = DatabaseHelper.GetStoredProcedureItem(connectionString, "GetReservedUnreservedPhoneNumbersPerDevice", MapPhoneNumberReport, parameters);

            return Ok(phoneNumbersReport);
        }

        private PhoneNumberReport MapPhoneNumberReport(SqlDataReader reader)
        {
            PhoneNumberReport phoneNumberReport = new PhoneNumberReport
            {
                Device = (string)reader["Device"],
                PhoneNumbersStatus = (string)reader["Phone Numbers Status"],
                NumberOfPhoneNumbers = (int)reader["# of Phone Numbers"]
            };

            return phoneNumberReport;
        }





    }
}
