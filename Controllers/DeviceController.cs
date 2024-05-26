using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;
using angulaJS.Helpers;
using angulaJS.Models;

namespace angulaJS.Controllers.API
{
    [RoutePrefix("api/Device")]
    public class DeviceApiController : ApiController
    {
        private readonly string connectionString = "Data Source=DESKTOP-2E2FSVM;Initial Catalog=InternProject;Integrated Security=True;";

        // Get all devices
        [HttpGet]
        [Route("GetAllDevices")]
        public IHttpActionResult GetAllDevices()
        { 
            List<Device> devices = DatabaseHelper.GetStoredProcedureItem(connectionString, "GetAllDevices", MapDevice);

            return Ok(devices);
        }

        private Device MapDevice(SqlDataReader reader)
        {
            Device device = new Device
            {
                Id = (int)reader["Id"],
                Name = (string)reader["Name"]
            };

            return device;
        }


        // Add a new device
        [HttpPost]
        [Route("AddDevice")]
        public IHttpActionResult AddDevice(Device device)
        {
            List<SqlParameter> parameters = new List<SqlParameter>
    {
        new SqlParameter("@Name", device.Name)
    };

            int deviceId = DatabaseHelper.GetStoredProcedureItem(connectionString, "AddDevice", MapDeviceId, parameters).FirstOrDefault();

            return Ok(deviceId);
        }

        private int MapDeviceId(SqlDataReader reader)
        {
            if (reader.Read())
            {
                return reader.GetInt32(0);
            }

            return 0;
        }



        // Update a device
        [HttpPost]
        [Route("UpdateDevice")]
        public IHttpActionResult UpdateDevice(Device device)
        {
            List<SqlParameter> parameters = new List<SqlParameter>
    {
        new SqlParameter("@Id", device.Id),
        new SqlParameter("@Name", device.Name)
    };

            bool isUpdated = DatabaseHelper.ExecuteNonQueryStoredProcedure(connectionString, "UpdateDevice", parameters);

            return isUpdated ? (IHttpActionResult)Ok(true) : NotFound();
        }


        // Filter the devices
        [HttpGet]
        [Route("GetFilteredDevices")]
        public IHttpActionResult GetFilteredDevices(string filter)
        {
            List<SqlParameter> parameters = new List<SqlParameter>
    {
        new SqlParameter("@Filter", $"%{filter}%")
    };

            List<Device> devices = DatabaseHelper.GetStoredProcedureItem(connectionString, "GetFilteredDevices", MapDevice, parameters);

            return Ok(devices);
        }

      

    }
}
